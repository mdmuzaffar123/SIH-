def analyze(geometry, start_date, end_date, ee_module=None):

    if ee_module is None:
        return {
            "landSurfaceTemperature": None,
            "unit": "°C",
            "rating": "Not available"
        }, []

    collection = (
        ee_module.ImageCollection(
            "MODIS/061/MOD11A2"
        )
        .filterDate(start_date, end_date)
        .filterBounds(geometry)
        .select("LST_Day_1km")
    )

    image = collection.mean()

    result = image.reduceRegion(
        reducer=ee_module.Reducer.mean(),
        geometry=geometry,
        scale=1000,
        maxPixels=100000000
    )

    raw_value = (
        result.getInfo() or {}
    ).get("LST_Day_1km")

    if raw_value is not None:

        # MODIS scale factor: 0.02 Kelvin
        temperature_c = (raw_value * 0.02) - 273.15

        if temperature_c >= 40:
            rating = "Very High"

        elif temperature_c >= 35:
            rating = "High"

        elif temperature_c >= 28:
            rating = "Moderate"

        else:
            rating = "Low"

    else:
        temperature_c = None
        rating = "Not available"

    return {
        "landSurfaceTemperature": temperature_c,
        "unit": "°C",
        "rating": rating
    }, [
        {
            "name": "MODIS/061/MOD11A2",
            "provider": "Google Earth Engine / NASA",
            "period": f"{start_date} to {end_date}",
            "indicator": "Daytime Land Surface Temperature",
            "resolution": "1 km"
        }
    ]