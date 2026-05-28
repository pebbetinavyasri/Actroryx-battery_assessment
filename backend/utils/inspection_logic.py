# Battery inspection thresholds
VOLTAGE_MIN = 3.0     # Volts
TEMP_MAX = 60.0       # °C
IMPEDANCE_MAX = 0.07  # Ohms

def evaluate_checks(voltage: float, temperature: float, impedance: float, has_crack: bool) -> dict:
    """Evaluate all inspection criteria and return pass/fail per check + overall."""
    checks = {
        "voltage": "pass" if voltage > VOLTAGE_MIN else "fail",
        "temperature": "pass" if temperature < TEMP_MAX else "fail",
        "impedance": "pass" if impedance < IMPEDANCE_MAX else "fail",
        "crack": "pass" if not has_crack else "fail",
    }
    overall = "pass" if all(v == "pass" for v in checks.values()) else "fail"
    return {"checks": checks, "overall": overall}
