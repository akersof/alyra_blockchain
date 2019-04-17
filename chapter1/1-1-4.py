import math

class Cercle:
    def __init__(self, radius):
        self.radius = radius
    def perimetre(self):
        return 2 * math.pi * self.radius
    def aire(self):
        return math.pi * pow(self.radius, 2)

# Test class Cercle
c = Cercle(5)
print({'aire': c.aire(), 'perimetre': c.perimetre()})

