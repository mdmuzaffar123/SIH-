def analyze(geometry, start_date, end_date, ee_module=None):

    if ee_module is None:
        return {
            "ndvi": None,
            "rating": "Not available"
        }, []

    collection = (
        ee_module.ImageCollection(
            "COPERNICUS/S2_SR_HARMONIZED"
        )
        .filterDate(
            start_date,
            end_date
        )
        .filterBounds(
            geometry
        )
        .filter(
            ee_module.Filter.lt(
                "CLOUDY_PIXEL_PERCENTAGE",
                30
            )
        )
    )

    image = collection.median()

    ndvi_image = image.normalizedDifference(
        ["B8", "B4"]
    ).rename("ndvi")

    result = ndvi_image.reduceRegion(
        reducer=ee_module.Reducer.mean(),
        geometry=geometry,
        scale=10,
        maxPixels=100_000_000
    )

    value = (
        result.getInfo() or {}
    ).get("ndvi")

    if value is not None:

        if value < 0.25:
            rating = "Low"

        elif value < 0.5:
            rating = "Moderate"

        else:
            rating = "High"

    else:
        rating = "Not available"

    return {
        "ndvi": value,
        "rating": rating
    }, [
        {
            "name": "COPERNICUS/S2_SR_HARMONIZED",
            "provider": "Google Earth Engine",
            "period": f"{start_date} to {end_date}",
            "indicator": "Mean NDVI",
            "resolution": "10 m"
        }
    ]