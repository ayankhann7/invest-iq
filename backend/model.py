def prediction(stock, n_days, theme):
    import yfinance as yf
    import pandas as pd
    import numpy as np
    import plotly.graph_objs as go
    from sklearn.preprocessing import StandardScaler
    from sklearn.svm import SVR

    df = yf.download(stock, period="2y", auto_adjust=True, progress=False)

    if df.empty:
        raise Exception("No data")

    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    df = df[["Close"]].copy()
    df["Close"] = df["Close"].astype(float)

    df["Lag1"] = df["Close"].shift(1)
    df["Lag2"] = df["Close"].shift(2)
    df["Lag3"] = df["Close"].shift(3)
    df["RollingMean5"] = df["Close"].rolling(5).mean()
    df.dropna(inplace=True)

    X = df[["Lag1", "Lag2", "Lag3", "RollingMean5"]].values.astype(float)
    y = df["Close"].values.astype(float)

    scaler_X = StandardScaler()
    scaler_y = StandardScaler()

    X_scaled = scaler_X.fit_transform(X)
    y_scaled = scaler_y.fit_transform(y.reshape(-1, 1)).ravel()

    model = SVR(kernel="rbf", C=100, epsilon=0.01, gamma=0.1)
    model.fit(X_scaled, y_scaled)

    lag1 = float(df["Close"].iloc[-1].item() if hasattr(df["Close"].iloc[-1], 'item') else df["Close"].iloc[-1])
    lag2 = float(df["Close"].iloc[-2].item() if hasattr(df["Close"].iloc[-2], 'item') else df["Close"].iloc[-2])
    lag3 = float(df["Close"].iloc[-3].item() if hasattr(df["Close"].iloc[-3], 'item') else df["Close"].iloc[-3])

    future_prices = []

    for _ in range(n_days):
        rolling_mean = float((lag1 + lag2 + lag3) / 3)

        X_future = np.array([[lag1, lag2, lag3, rolling_mean]], dtype=float)
        X_future_scaled = scaler_X.transform(X_future)

        pred_scaled = model.predict(X_future_scaled)

        pred = float(scaler_y.inverse_transform(pred_scaled.reshape(-1, 1))[0][0])

        future_prices.append(pred)

        lag3 = lag2
        lag2 = lag1
        lag1 = pred

    last_date = df.index[-1]
    future_dates = pd.bdate_range(
        start=last_date + pd.Timedelta(days=1),
        periods=n_days
    )

    fig = go.Figure()

    fig.add_trace(
        go.Scatter(
            x=future_dates.strftime("%Y-%m-%d").tolist(),
            y=future_prices,
            mode="lines+markers",
            name="Forecast",
        )
    )

    from sklearn.metrics import mean_absolute_percentage_error
    y_pred = model.predict(X_scaled)
    y_actual = scaler_y.inverse_transform(y_scaled.reshape(-1,1)).ravel()
    y_predicted = scaler_y.inverse_transform(y_pred.reshape(-1,1)).ravel()
    mape = mean_absolute_percentage_error(y_actual, y_predicted) * 100

    fig.update_layout(
        title=f"{stock} — {n_days}-Day Forecast (Test MAPE: {mape:.1f}%)",
        template="plotly_dark" if theme == "dark" else "plotly_white",
        height=500,
        xaxis_title="Date",
        yaxis_title="Close Price",
        margin=dict(l=40, r=60, t=50, b=40),
        modebar={
            "bgcolor": "rgba(0,0,0,0)",
            "color": "#198754" if theme == "light" else "#c3ff00",
            "orientation": "h",
        },
    )

    return fig