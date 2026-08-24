from app.core.config import get_settings


def analyze(geometry, ee_module=None):
    s = get_settings()

    if ee_module is None:
        return {
            "averageRadiance": None,
            "lowLightAreaKm2": None,
            "priority": "Not available",
            "unit": "avg_rad",
        }, []

    collection = (
        ee_module.ImageCollection(
            "NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG"
        )
        .filterDate(
            s.gee_nightlight_start_date,
            s.gee_nightlight_end_date
        )
        .filterBounds(geometry)
        .select("avg_rad")
    )

    image = collection.mean()

    # Calculate average night-light radiance
    average_result = image.reduceRegion(
        reducer=ee_module.Reducer.mean(),
        geometry=geometry,
        scale=500,
        maxPixels=1_000_000_000,
    )

    average = (average_result.getInfo() or {}).get("avg_rad")

    low = None

    if average is not None:
        # Identify low-light areas
        low_light = (
            image
            .lt(s.low_light_threshold)
            .selfMask()
            .multiply(ee_module.Image.pixelArea())
        )

        values = low_light.reduceRegion(
            reducer=ee_module.Reducer.sum(),
            geometry=geometry,
            scale=500,
            maxPixels=1_000_000_000,
        ).getInfo() or {}

        low = values.get("avg_rad")

        if low is not None:
            low = low / 1_000_000

    if average is not None:
        if average < s.low_light_threshold:
            priority = "High"
        else:
            priority = "Moderate"
    else:
        priority = "Not available"

    return {
        "averageRadiance": average,
        "lowLightAreaKm2": low,
        "priority": priority,
        "unit": "avg_rad",
    }, [
        {
            "name": "NOAA/VIIRS/DNB/MONTHLY_V1/VCMCFG",
            "provider": "Google Earth Engine",
            "period": (
                f"{s.gee_nightlight_start_date} "
                f"to {s.gee_nightlight_end_date}"
            ),
            "indicator": "avg_rad and night-light energy-access proxy",
            "resolution": "500 m",
        }
    ]