class Helper {
    hexToDecimal(hex) {
        return parseInt(hex.replace("#",""), 16)
    }
}

export default new Helper
