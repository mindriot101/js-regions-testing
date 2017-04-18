var Bound = (function () {
    function Bound(xmin, xmax, ymin, ymax) {
        this.xmin = xmin;
        this.xmax = xmax;
        this.ymin = ymin;
        this.ymax = ymax;
    }
    Bound.prototype.contains = function (e) {
        return ((e.x >= this.xmin) &&
            (e.x <= this.xmax) &&
            (e.y >= this.ymin) &&
            (e.y <= this.ymax));
    };
    return Bound;
}());
var RegionHandler = (function () {
    function RegionHandler(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        if (this.ctx === null) {
            console.error("2d rendering context not supported :(");
        }
    }
    RegionHandler.prototype.add_mouse_handlers = function (image_url, regions_url) {
        var self = this;
        self.image = new Image();
        self.image.src = image_url;
        self.image.onload = function (event) {
            self.canvas.width = self.image.naturalWidth;
            self.canvas.height = self.image.naturalHeight;
            self.reset_canvas();
            $.getJSON(regions_url, function (regions) {
                self.add_handlers(regions);
            }).fail(function () {
                self.show_error("Regions not found. Interactivity disabled");
                console.error("Cannot fetch regions url: " + regions_url);
            });
        };
        self.image.onerror = function (e) {
            console.error("Cannot load image: " + image_url);
        };
    };
    RegionHandler.prototype.add_handlers = function (regions) {
        var self = this;
        var bounds = self.compute_bounds(regions);
        self.canvas.addEventListener('mousemove', function (e) {
            self.reset_canvas();
            var click = self.scaled_click(e);
            if (!bounds.contains(click)) {
                return;
            }
            var region = self.region_for_event(regions, click);
            if (region != null) {
                self.add_region(region);
            }
        });
        self.canvas.addEventListener('click', function (e) {
            self.reset_canvas();
            var click = self.scaled_click(e);
            if (!bounds.contains(click)) {
                return;
            }
            var region = self.region_for_event(regions, click);
            if (region != null) {
                console.log('Changing window url to ' + region.href);
            }
        });
        self.canvas.addEventListener('mouseleave', function (e) {
            self.reset_canvas();
        });
    };
    RegionHandler.prototype.scaled_click = function (e) {
        var scaling = {
            x: this.canvas.width / this.canvas.clientWidth,
            y: this.canvas.height / this.canvas.clientHeight,
        };
        var click = {
            x: e.offsetX * scaling.x,
            y: e.offsetY * scaling.y,
        };
        return click;
    };
    RegionHandler.prototype.compute_bounds = function (regions) {
        var xmin = Infinity;
        var xmax = -Infinity;
        var ymin = Infinity;
        var ymax = -Infinity;
        for (var _i = 0, regions_1 = regions; _i < regions_1.length; _i++) {
            var region = regions_1[_i];
            if (region.xmin < xmin)
                xmin = region.xmin;
            if (region.xmax > xmax)
                xmax = region.xmax;
            if (region.ymin < ymin)
                ymin = region.ymin;
            if (region.ymax > ymax)
                ymax = region.ymax;
        }
        return new Bound(xmin, xmax, ymin, ymax);
    };
    RegionHandler.prototype.region_for_event = function (regions, e) {
        var n_regions = regions.length;
        var x = e.x;
        var y = e.y;
        for (var _i = 0, regions_2 = regions; _i < regions_2.length; _i++) {
            var r = regions_2[_i];
            if ((x >= r.xmin) && (x < r.xmax) && (y >= r.ymin) && (y < r.ymax)) {
                return r;
            }
        }
        return null;
    };
    RegionHandler.prototype.add_region = function (region) {
        var self = this;
        self.reset_canvas();
        var dx = region.xmax - region.xmin;
        var dy = region.ymax - region.ymin;
        self.context().strokeStyle = 'red';
        self.context().strokeRect(region.xmin, region.ymin, dx, dy);
    };
    RegionHandler.prototype.context = function () {
        return this.ctx;
    };
    RegionHandler.prototype.reset_canvas = function () {
        this.context().clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context().drawImage(this.image, 0, 0);
    };
    RegionHandler.prototype.show_error = function (text) {
        this.context().textAlign = 'center';
        this.context().font = '16px serif';
        this.reset_canvas();
        this.context().fillStyle = 'red';
        this.context().fillText(text, this.canvas.width / 2, 0.1 * this.canvas.height);
    };
    return RegionHandler;
}());
//# sourceMappingURL=main.js.map