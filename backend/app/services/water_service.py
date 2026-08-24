def analyze(geometry, start_date, end_date, ee_module=None):

    if ee_module is None:
        return {
            "stressIndex": None,
            "rating": "Not available",
            "dataset": None
        }, []

    collection = (
        ee_module.ImageCollection(
            "UCSB-CHG/CHIRPS/DAILY"
        )
        .filterDate(start_date, end_date)
        .filterBounds(geometry)
        .select("precipitation")
    )

    # Rainfall during selected period
    current_image = collection.sum()

    current_result = current_image.reduceRegion(
        reducer=ee_module.Reducer.mean(),
        geometry=geometry,
        scale=5566,
        maxPixels=100000000
    )

    current_rainfall = (
        current_result.getInfo() or {}
    ).get("precipitation")

    if current_rainfall is None:
        return {
            "stressIndex": None,
            "rating": "Not available",
            "dataset": "CHIRPS"
        }, [
            {
                "name": "UCSB-CHG/CHIRPS/DAILY",
                "provider": "Google Earth Engine / UCSB-CHG",
                "period": f"{start_date} to {end_date}",
                "indicator": "Rainfall",
                "resolution": "5.6 km"
            }
        ]

    # Calculate stress using rainfall thresholds.
    # Lower rainfall = higher water stress.
    if current_rainfall >= 1200:
        stress_index = 0.10
        rating = "Low"

    elif current_rainfall >= 800:
        stress_index = 0.35
        rating = "Moderate"

    elif current_rainfall >= 500:
        stress_index = 0.65
        rating = "High"

    else:
        stress_index = 0.90
        rating = "Very High"

    return {
        "stressIndex": stress_index,
        "rainfallMm": current_rainfall,
        "rating": rating,
        "dataset": "CHIRPS Daily"
    }, [
        {
            "name": "UCSB-CHG/CHIRPS/DAILY",
            "provider": "Google Earth Engine / UCSB-CHG",
            "period": f"{start_date} to {end_date}",
            "indicator": "Annual precipitation / water-stress proxy",
            "resolution": "5.6 km"
        }
    ]