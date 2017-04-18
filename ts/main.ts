interface Region {
    xmin: number;
    xmax: number;
    ymin: number;
    ymax: number;
    href: string;
}

class RegionHandler {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D | null;
    image: HTMLImageElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        if (this.ctx === null) {
            console.error("2d rendering context not supported :(");
        }
    }

    public add_mouse_handlers(image_url: string, regions_url: string) {
        let self = this;
        self.image = new Image();
        self.image.src = image_url;
        self.image.onload = function(event) {
            self.canvas.width = self.image.naturalWidth;
            self.canvas.height = self.image.naturalHeight;
            self.reset_canvas();

            $.getJSON(regions_url, function(regions: Array<Region>) {
                self.add_region(regions[50]);
            });
        };
    }

    add_region(region: Region) {
        let self = this;
        console.log('Adding region: ', region);

        self.reset_canvas();

        let dx = region.xmax - region.xmin;
        let dy = region.ymax - region.ymin;

        self.context().strokeStyle = 'red';
        self.context().strokeRect(region.xmin, region.ymin, dx, dy);
    }

    context(): CanvasRenderingContext2D {
        return this.ctx!;
    }

    reset_canvas() {
        this.context().clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context().drawImage(this.image, 0, 0);
    }
}

window.onload = function() {
    var elem = <HTMLCanvasElement> document.getElementById("plotCanvas");
    var handler = new RegionHandler(elem);
    handler.add_mouse_handlers('image.png', 'regions.json');
}

