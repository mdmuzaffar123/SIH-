# UrjaDhara GEE Insights Backend

FastAPI REST layer between the `Frontend` React app and server-side Google Earth Engine. No credentials are exposed to the browser.

## Run

From `backend/`, install `requirements.txt`, then run `uvicorn app.main:app --reload --port 8000`. Interactive API docs are at `/docs` and `/redoc`.

The included `.env` enables `USE_MOCK_DATA=true` for a safe presentation mode. Set it to `false` only after configuring `GEE_PROJECT_ID` and server-side authentication. For local Earth Engine credentials, use `earthengine authenticate`; production should use a secret manager/service account.

## Endpoints

`/api/health`, `/api/health/gee`, `/api/location/search`, `/api/location/boundary`, `/api/gee/analysis`, `/api/gee/map`, `/api/gee/compare`, `/api/recommendations`, `/api/reports/summary`.

## Scientific boundary

The existing workspace contains no `gee-final-` Python files, so no prior implementation could be imported. The live service preserves the supplied VIIRS dataset design (`NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG`, `avg_rad`) and Sentinel-2 NDVI structure. Solar, water stress, and temperature return `null` until validated datasets are configured; demo values are clearly marked as mock data.

Run `pytest -q` from `backend/`.
