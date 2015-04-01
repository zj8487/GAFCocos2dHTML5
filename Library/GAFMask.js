
gaf.Mask = gaf.Object.extend
({
    _className: "GAFMask",
    _clippingNode: null,
    _maskNode: null,

    ctor : function(gafSpriteProto)
    {
        this._super();
        cc.assert(gafSpriteProto, "Error! Missing mandatory parameter.");
        this._gafproto = gafSpriteProto;
    },

    setLooped: function (looped, recursively)
    {
        this._maskNode.setLooped(looped, recursively);
    },

    getBoundingBoxForCurrentFrame: function ()
    {
        return this._maskNode.getBoundingBoxForCurrentFrame();
    },

    setAnimationRunning: function (value, recursively)
    {
        this._maskNode.setAnimationRunning(value, recursively)
    },

    _init : function()
    {
        var maskNodeProto = this._gafproto.getMaskNodeProto();
        cc.assert(maskNodeProto, "Error. Mask node for id ref " + this._gafproto.getIdRef() + " not found.");
        this._maskNode = maskNodeProto._gafConstruct();
            this._clippingNode = cc.ClippingNode.create(this._maskNode);
        this._clippingNode.setAlphaThreshold(0.5);
        this.addChild(this._clippingNode);

    },

    setExternalTransform : function(affineTransform)
    {
        if(!cc.affineTransformEqualToTransform(this._maskNode._additionalTransform, affineTransform))
        {
            this._maskNode.setAdditionalTransform(affineTransform);
        }
    },

    _getNode : function()
    {
        return this._clippingNode;
    },

    _step: function ()
    {
        if(this._maskNode._step)
            this._maskNode._step();
    }


});