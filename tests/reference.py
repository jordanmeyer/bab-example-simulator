"""Independent reference: standard-library normal CDF; does not import app code."""
import math


def reference(quantity, mean, deviation, low, high, price, recovery, fixed):
    normal_cdf = lambda x: (1 + math.erf(x / math.sqrt(2))) / 2
    lower = normal_cdf(-mean / deviation)
    previous = expected = loss = sold = 0
    for units in range(quantity + 1):
        cumulative = 1 if units == quantity else (normal_cdf((units + .5 - mean) / deviation) - lower) / (1 - lower)
        probability = cumulative - previous
        previous = cumulative
        sold += units * probability
        revenue = units * price + (quantity - units) * recovery - fixed
        expected += probability * (revenue - quantity * (low + high) / 2)
        cost_loss = (revenue - quantity * low < 0) if low == high else max(0, min(1, (high - (math.floor(revenue / quantity) + .5)) / (high - low)))
        loss += probability * cost_loss
    return expected, loss, sold


for quantity in [400, 500, 600]:
    print(quantity, reference(quantity, 500, 120, 1800, 2400, 4500, 1000, 400000))
print('half normal', reference(100, 0, 50, 1000, 1000, 2000, 0, 0))
