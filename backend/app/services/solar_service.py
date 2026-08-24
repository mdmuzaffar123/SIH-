def analyze(geometry, start_date, end_date, ee_module=None):

    if ee_module is None:
        return {
            "potential": None,
            "unit": "kWh/m²/day",
            "rating": "Not available"
        }, []

    collection = (
        ee_module.ImageCollection(
            "ECMWF/ERA5_LAND/DAILY_AGGR"
        )
        .filterDate(start_date, end_date)
        .filterBounds(geometry)
        .select("surface_solar_radiation_downwards_sum")
    )

    image = collection.sum()

    result = image.reduceRegion(
        reducer=ee_module.Reducer.mean(),
        geometry=geometry,
        scale=11132,
        maxPixels=100000000
    )

    value = (result.getInfo() or {}).get(
        "surface_solar_radiation_downwards_sum"
    )

    if value is not None:

        # J/m² → kWh/m²
        total_kwh = value / 3_600_000

        # Convert annual/period value to daily average
        days = 365

        potential = total_kwh / days

        if potential >= 5.0:
            rating = "High"
        elif potential >= 4.0:
            rating = "Moderate"
        else:
            rating = "Low"

    else:
        potential = None
        rating = "Not available"

    return {
        "potential": potential,
        "unit": "kWh/m²/day",
        "rating": rating
    }, [
        {
            "name": "ECMWF/ERA5_LAND/DAILY_AGGR",
            "provider": "Google Earth Engine / ECMWF",
            "period": f"{start_date} to {end_date}",
            "indicator": "Surface solar radiation",
            "resolution": "11.1 km"
        }
    ]