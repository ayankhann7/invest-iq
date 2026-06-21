from flask import Flask, request, jsonify
from flask_cors import CORS
import yfinance as yf
import pandas as pd
import numpy as np
import plotly.graph_objs as go
import smtplib
import re
import json
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from model import prediction
from dotenv import load_dotenv
import os
load_dotenv()
app = Flask(__name__)
CORS(app)

SENDER_EMAIL = os.getenv("SENDER_EMAIL")
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")
RECEIVER_EMAIL = os.getenv("RECEIVER_EMAIL")


class NumpyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super().default(obj)


def fig_to_json(fig):
    return json.loads(json.dumps(fig.to_dict(), cls=NumpyEncoder))


def download_and_fix(ticker, start, end=None):
    df = yf.download(ticker, start=start, end=end, auto_adjust=True, progress=False)
    if df.empty:
        return df
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)
    df.reset_index(inplace=True)
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)
    date_col = None
    for col in df.columns:
        if str(col).lower() in ("date", "datetime", "index", "timestamp"):
            date_col = col
            break
    if date_col is None:
        df.insert(0, "Date", df.index)
    elif date_col != "Date":
        df.rename(columns={date_col: "Date"}, inplace=True)
    df["Date"] = pd.to_datetime(df["Date"]).dt.strftime("%Y-%m-%d")
    for col in df.columns:
        if col != "Date":
            df[col] = pd.to_numeric(df[col], errors="coerce")
    return df


def get_stock_price_fig(df, theme):
    fig = go.Figure()
    fig.add_trace(go.Candlestick(
        x=df["Date"].tolist(),
        open=df["Open"].tolist(),
        high=df["High"].tolist(),
        low=df["Low"].tolist(),
        close=df["Close"].tolist(),
        name="Price",
        increasing_line_color="#26a69a",
        decreasing_line_color="#ef5350"
    ))
    fig.update_layout(
        title="Closing and Opening Price vs Date",
        template="plotly_dark" if theme == "dark" else "plotly_white",
        height=500,
        xaxis_title="Date",
        yaxis_title="Price",
        xaxis_rangeslider_visible=False,
        margin=dict(l=40, r=60, t=50, b=40),
        modebar={
            "bgcolor": "rgba(0,0,0,0)",
            "color": "#198754" if theme == "light" else "#c3ff00",
            "orientation": "h",
        },
    )
    return fig


def get_indicators_fig(df, theme):
    df = df.copy()
    df["EMA_20"] = df["Close"].ewm(span=20, adjust=False).mean()
    df["EMA_50"] = df["Close"].ewm(span=50, adjust=False).mean()
    fig = go.Figure()
    fig.add_trace(go.Candlestick(
        x=df["Date"].tolist(),
        open=df["Open"].tolist(),
        high=df["High"].tolist(),
        low=df["Low"].tolist(),
        close=df["Close"].tolist(),
        name="Price",
        increasing_line_color="#26a69a",
        decreasing_line_color="#ef5350"
    ))
    fig.add_trace(go.Scatter(
        x=df["Date"].tolist(), y=df["EMA_20"].tolist(),
        mode="lines", name="EMA 20",
        line=dict(color="#2196F3", width=1.5)
    ))
    fig.add_trace(go.Scatter(
        x=df["Date"].tolist(), y=df["EMA_50"].tolist(),
        mode="lines", name="EMA 50",
        line=dict(color="#FF9800", width=1.5)
    ))
    fig.update_layout(
        title="Exponential Moving Average vs Date",
        template="plotly_dark" if theme == "dark" else "plotly_white",
        height=500,
        xaxis_title="Date",
        yaxis_title="Price",
        xaxis_rangeslider_visible=False,
        legend=dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
        margin=dict(l=40, r=60, t=60, b=40),
        modebar={
            "bgcolor": "rgba(0,0,0,0)",
            "color": "#198754" if theme == "light" else "#c3ff00",
            "orientation": "h",
        },
    )
    return fig


def send_email(name, sender_email, message):
    msg = MIMEMultipart()
    msg["From"] = f"InvestIQ Contact <{SENDER_EMAIL}>"
    msg["To"] = RECEIVER_EMAIL
    msg["Reply-To"] = sender_email
    msg["Subject"] = "New Contact Message - InvestIQ"
    body = f"New message received from InvestIQ Contact Form\n\nName: {name}\nEmail: {sender_email}\n\nMessage:\n{message}"
    msg.attach(MIMEText(body, "plain"))
    try:
        server = smtplib.SMTP("smtp.gmail.com", 587, timeout=10)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, RECEIVER_EMAIL, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        print("Email failed:", e)
        return False


@app.route("/stock-info", methods=["GET"])
def stock_info():
    ticker = request.args.get("ticker", "").upper()
    if not ticker:
        return jsonify({"error": "Ticker is required"}), 400
    try:
        t = yf.Ticker(ticker)
        info = t.info or {}
        return jsonify({
            "name": info.get("shortName", ticker),
            "description": info.get("longBusinessSummary", "No description available.")
        })
    except Exception as e:
        print("stock-info error:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/stock-chart", methods=["GET"])
def stock_chart():
    ticker = request.args.get("ticker", "").upper()
    start = request.args.get("start")
    end = request.args.get("end") or None
    theme = request.args.get("theme", "dark")

    if not ticker or not start:
        return jsonify({"error": "ticker and start date are required"}), 400

    try:
        df = download_and_fix(ticker, start, end)
        if df.empty:
            return jsonify({"error": "No data found for this ticker"}), 404
        fig = get_stock_price_fig(df, theme)
        return jsonify({"figure": fig_to_json(fig)})
    except Exception as e:
        print("stock-chart error:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/indicators", methods=["GET"])
def indicators():
    ticker = request.args.get("ticker", "").upper()
    start = request.args.get("start")
    end = request.args.get("end") or None
    theme = request.args.get("theme", "dark")

    if not ticker or not start:
        return jsonify({"error": "ticker and start date are required"}), 400

    try:
        df = download_and_fix(ticker, start, end)
        if df.empty:
            return jsonify({"error": "No data found for this ticker"}), 404
        fig = get_indicators_fig(df, theme)
        return jsonify({"figure": fig_to_json(fig)})
    except Exception as e:
        print("indicators error:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/forecast", methods=["GET"])
def forecast():
    ticker = request.args.get("ticker", "").upper()
    days = request.args.get("days")
    theme = request.args.get("theme", "dark")

    if not ticker:
        return jsonify({"error": "Ticker is required"}), 400
    if not days:
        return jsonify({"error": "Days is required"}), 400

    try:
        n = int(days)
    except ValueError:
        return jsonify({"error": "Days must be a valid number"}), 400

    if n <= 0:
        return jsonify({"error": "Days must be a positive number"}), 400

    try:
        fig = prediction(ticker, n, theme)
        return jsonify({"figure": fig_to_json(fig)})
    except Exception as e:
        print("forecast error:", e)
        return jsonify({"error": str(e)}), 500


@app.route("/contact", methods=["POST"])
def contact():
    data = request.get_json()
    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    message = data.get("message", "").strip()

    if not name or not email or not message:
        return jsonify({"error": "Please fill in all fields"}), 400

    email_pattern = r"^[\w\.-]+@[\w\.-]+\.\w+$"
    if not re.match(email_pattern, email):
        return jsonify({"error": "Please enter a valid email address"}), 400

    success = send_email(name, email, message)
    if success:
        return jsonify({"message": "Message sent successfully! We'll get back to you soon."})
    else:
        return jsonify({"error": "Failed to send message. Please try again later."}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)