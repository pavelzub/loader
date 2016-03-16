function loader(refs, count, width){
	if (!refs || count <= 0) throw new Error();
	this.setCellStatus = [];
	this.width = width;
	this.refs = refs;
	this.count = Math.min(refs.length, count);
	this.counter = 0;
	this.createTable();
}

loader.prototype.createTable = function(){
	var self = this;
	self.table = document.createElement("table");
	for(var i = 0; i < (self.refs.length / self.width | 0); i++){
		var curRow = self.table.insertRow(i);
		for(var j = 0; j < self.width; j++){
			let curCell = curRow.insertCell(j);
			$(curCell).addClass("noprogres");
			self.setCellStatus.push(function(status){
				$(curCell).addClass(status);
			});
			
		}
	}
	document.body.appendChild(self.table);
}

loader.prototype.load = function(){
	for (var i = 0; i < this.count; i++){
		this.loadData(i);
	}
}
loader.prototype.loadData = function(index){
	var self = this;
	self.counter++;
	self.setCellStatus[index]("loading");
	$.get(self.refs[index]).then(
        function(){self.setCellStatus[index]("success");},
        function(){self.setCellStatus[index]("error");}
    ).always(
        function(){
			if(self.counter < self.refs.length)
                self.loadData(self.counter);
        }
    );
}
