sigmaInstance = new sigma({
   renderer: {
      container: document.getElementById('container'),
      type: 'canvas'
   },
   settings: {
      doubleClickEnabled: false,
      minEdgeSize: 0.5,
      maxEdgeSize: 4,
      enableEdgeHovering: true,
      edgeHoverColor: 'edge',
      defaultEdgeHoverColor: '#000',
      edgeHoverSizeRatio: 1,
      edgeHoverExtremities: true,
   }
});
var nodeId = 0,
      edgeId = 0,
      nodeIdList = [];


sigmaInstance.bind('clickNode', function(e) {
   if(nodeIdList.length >= 2) {
      nodeIdList = [];
   }

   nodeIdList.push(e.data.node.id);

   if(nodeIdList.length === 2) {
      if(nodeIdList[0] === nodeIdList[1]) {
         nodeIdList = [];
         return;
      }
      ++edgeId;
      sigmaInstance.graph.addEdge({
         id: edgeId,
         source: nodeIdList[0],
         target: nodeIdList[1]
      });
      sigmaInstance.refresh();
   }
})


// New Node
sigmaInstance.bind('clickStage', function(e) {
   if(nodeIdList.length === 1) {
      nodeIdList = [];
      return;
   }
   nodeIdList = [];
   var x,
         y;

   x = sigma.utils.getX(e.data.captor);
   y = sigma.utils.getY(e.data.captor);

   ++nodeId;
   sigmaInstance.graph.addNode({
      id: nodeId,
      size: 10,
      label: nodeId + '',
      x: x,
      y: y,
      dX: 0,
      dY: 0
   });

   sigmaInstance.refresh();
});