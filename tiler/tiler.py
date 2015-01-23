import os, math
from PIL import Image

class Tiler:
    '''
    Example:
        Tiler(dest='out').create_tiles('1002')
    '''
    def __init__(self, tile_size=256, dest=''):
        self.tile_size = tile_size
        self.dest = dest

    def scale(self, img, size):
        width, height = img.size
        if width <= size and height <= size: return img.copy()
        while width > size or height > size:
            width /= 2.0
            height /= 2.0
        r = img.resize((int(width), int(height)), Image.ANTIALIAS)
        return r

    def create_tile(self, image, zoom, x, y):
        image = Image.open(image)
        tile_size = self.tile_size
        img = self.scale(image, (2**zoom)*tile_size)
        return img.crop((
            x*tile_size, y*tile_size,
            min((x+1)*tile_size, img.size[0]),
            min((y+1)*tile_size, img.size[1]),
        ))

    def create_tiles(self, image, save=None):
        ceil = lambda x: int(math.ceil(x))
        image = Image.open(image)
        level = ceil(math.log(max(image.size)/float(self.tile_size), 2))
        for lv in xrange(level+1):
            tile_size = self.tile_size
            img = self.scale(image, (2**lv) * tile_size)
            for x in xrange(ceil(img.size[0]/float(tile_size))):
                for y in xrange(ceil(img.size[1]/float(tile_size))):
                    tile = img.crop((
                        x*tile_size, y*tile_size,
                        min((x+1)*tile_size, img.size[0]),
                        min((y+1)*tile_size, img.size[1]),
                    ))
                    save(tile, lv, x, y)


