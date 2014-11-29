gaf.DataReader = function(data) {
    this.dataRaw = data;
    this.buf = new DataView(data);
    this.offset = [0];
};

gaf.DataReader.prototype.constructor = gaf.DataReader;

gaf.DataReader.prototype.newOffset = function(size){
    this.offset[this.offset.length - 1] += size;
    if(this.getOffset() > this.maxOffset()){
        throw new Error("GAF out of bounds");
    }
    return this.offset[this.offset.length - 1] - size;
};

gaf.DataReader.prototype.maxOffset = function(){
    if(this.offset.length == 1){
        return this.buf.byteLength;
    }
    else{
        return this.offset[this.offset.length - 2];
    }
};

gaf.DataReader.prototype.getOffset = function(size){
    return this.offset[this.offset.length - 1];
};

gaf.DataReader.prototype.Ubyte = function() {
    return this.buf.getUint8(this.newOffset(1));
};

gaf.DataReader.prototype.Boolean = function() {
    return this.buf.getUint8(this.newOffset(1));
};

gaf.DataReader.prototype.Uint = function() {
    return this.buf.getUint32(this.newOffset(4), true);
};

gaf.DataReader.prototype.int = function() {
    return this.buf.getInt32(this.newOffset(4), true);
};

gaf.DataReader.prototype.Ushort = function() {
    return this.buf.getUint16(this.newOffset(2), true);
};

gaf.DataReader.prototype.float = function() {
    return this.buf.getFloat32(this.newOffset(4), true);
};

gaf.DataReader.prototype.String = function() {
    var strLen = this.Ushort();

    return decodeURIComponent(escape(String.fromCharCode.apply(null, new Uint8Array(this.dataRaw.slice(this.newOffset(strLen), this.getOffset())))));
};

gaf.DataReader.prototype.startNestedBuffer = function(length) {
    this.offset.push(this.offset[this.offset.length-1]);
    this.offset[this.offset.length-2] += length;
};

gaf.DataReader.prototype.endNestedBuffer = function() {
    if (this.offset.length == 1) throw new Error('No nested buffer available');
    this.offset.pop();
};

gaf.DataReader.prototype.Point = function(){
    return {
        x: this.float(),
        y: this.float()
    };
};

gaf.DataReader.prototype.Rect = function(){
    return {
        x: this.float(),
        y: this.float(),
        width: this.float(),
        height: this.float()
    };
};

gaf.DataReader.prototype.Matrix = function(){
    return {
        a: this.float(),
        b: this.float(),
        c: this.float(),
        d: this.float(),
        tx: this.float(),
        ty: this.float()
    };
};

gaf.DataReader.prototype.seek = function(pos){
    this.offset[this.offset.length-1] = pos;
};

gaf.DataReader.prototype.tell = function(){
    return this.offset[this.offset.length-1];
};

/* Creates a fields parsing function
* @ returns a function that will read from DataReader `field` of type `type`
* @`key` - key for read data to be stored
* @`data` - data to store. Can be DataReader function name or a function that will return a value
* Note. Parameters pair `key` and `data` can be repeated any number of times*/

gaf.DataReader.prototype.fields = function(){
    var self = this;
    var arguments_ = arguments;
    return function(){
        arguments.callee.result = {};
        var i = 0;
        if(arguments_.length % 2){
            throw new Error('Number of arguments is not even');
        }
        while(i < arguments_.length){
            var field = arguments_[i++];
            var func = arguments_[i++];
            if(typeof func === 'function'){
                arguments.callee.result[field] = func();
            }
            else if (func in self && typeof self[func] === 'function'){
                arguments.callee.result[field] = self[func].call(self);
            }
            else{
                throw new Error('Object DataReader has no function `' + func + '`');
            }
        }
        return arguments.callee.result;
    }
};

/*
* Creates a parsing function
* @ returns function that will execute expression if caller's `result` field has `key` equal to `value` parameter
* @ `key` - key in caller's `result` element
* @ `value` - expected value of the `key` or a comparator function
* @ `func` - function to execute if condition is true
* */

gaf.DataReader.prototype.condition = function(key, value, func){
    var self = this;
    var arguments_ = arguments;
    return function() {
        if(arguments_.length != 3){
            throw new Error('Condition function');
        }
        var parent = arguments.callee.caller;
        if(!('result' in parent)){
            throw new Error('Condition function caller has no key `result`');
        }
        var container = parent.result;
        var field = arguments_[0];
        var value = arguments_[1];
        var exec = arguments_[2];

        var evaluate = null;
        if(typeof value === 'function'){
            evaluate = function(){return value(container[field]);};
        }
        else{
            evaluate = function(){return value == container[field];};
        }
        if(evaluate()){
            return exec();
        }
        else{
            return null;
        }
    }
};

/*
* Creates an array parsing function
* @ returns function that will execute `func` number of times read from DataReader
* @ `type` - type of count number
* @ `func` - function to be executed
* */

gaf.DataReader.prototype.array = function(){
    var self = this;
    var arguments_ = arguments;
    return function() {
        arguments.callee.result = [];
        var length = self[arguments_[0]].call(self);
        for (var i = 0; i < length; ++i) {
            var r = arguments_[1].call();
            arguments.callee.result.push(r);
        }
        return arguments.callee.result;
    }
};
