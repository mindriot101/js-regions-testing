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
                self.add_handlers(regions);
            });
        };
    }

    add_handlers(regions: Array<Region>) {
        let self = this;
        /* @Optimisation: pre-compute the bounds of all regions to work out if
         * the mouse is even over the imaging region. If it isn't then the handlers
         * can exit early */
        self.canvas.addEventListener('mousemove', function(e: Event) {
            let region: Region | null = self.region_for_event(regions, e);
            if (region != null) {
                self.add_region(region);
            } else {
                self.reset_canvas();
            }
        });

        self.canvas.addEventListener('click', function(e: Event) {
        });
    }

    region_for_event(regions: Array<Region>, e): Region | null {

        let n_regions = regions.length;
        let x = e.offsetX;
        let y = e.offsetY;

        for (var i=0; i<n_regions; i++) {
            let r = regions[i];
            if ((x >= r.xmin) && (x < r.xmax) && (y >= r.ymin) && (y < r.ymax)) {
                return r;
            }
        }

        return null;
    }

    add_region(region: Region) {
        let self = this;

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

