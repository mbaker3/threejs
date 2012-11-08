//Utility methods that are pretty generic to any application
var UTILS = (function(){
	return {
		
		createGrid : function(size, subdivs, gridColor, opacity, originMarker) {
			//defaults
			originMarker = originMarker || false;
			opacity = opacity || 0.2;
			gridColor = gridColor || 0x000000;

			//make the grid
			var container = new THREE.Object3D();
			var halfSize = size * 0.5;
			var cellSize = size / subdivs;

			var geometry = new THREE.Geometry();
			geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(-halfSize, 0, 0)));
			geometry.vertices.push(new THREE.Vertex(new THREE.Vector3(halfSize, 0, 0)));

			for(var i = 0; i <= subdivs; i++){
				var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color:gridColor, opacity: opacity}));
				line.position.z = (i * cellSize) - halfSize;
				container.add(line);

				var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({color:gridColor, opacity: opacity}));
				line.position.x = (i * cellSize) - halfSize;
				line.rotation.y = 90 * Math.PI / 180;
				container.add(line);
			}
			
			//Return some extra attributes of the grid
			return {object3D:container, 
					attr:{
						cellSize: cellSize,
						halfSize: halfSize
					}
				};
		},

		measureHeight : function(obj) {
			var bb = obj.geometry.boundingBox;
			return (bb.max.y - bb.min.y) * obj.scale.y;
		},

		//XYZ corresponds to Width, Height, Depth
		measureObject : function(obj) {
			var bb = obj.geometry.boundingBox;

			return {
				x: (bb.max.x - bb.min.x) * obj.scale.x,
				y: (bb.max.y - bb.min.y) * obj.scale.y,
				z: (bb.max.z - bb.min.z) * obj.scale.z
			}
		}
	}
})()