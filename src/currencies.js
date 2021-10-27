const val = (name, rate) => ({name, rate});

export default {
    USD: val('United States Dollar', 1),
    IDR: val('Indonesian Rupiah', 14410.45),
    EUR: val('Euro', 0.85694),
    GBP: val('British Pound', 0.75894),
    SGD: val('Singapore Dollar', 1.36637),
    JPY: val('Japanese Yen', 110.974),
    CAD: val("Canadian Dollar", 1.24),
    CHF: val('Swiss Franc', 0.92),
    INR: val('Indian Rupee', 74.96),
    MYR: val('Malaysian Ringgit', 4.15),
    KRW: val('South Korean Won', 1167.42),
}