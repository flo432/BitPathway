import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';



declare var $:JQueryStatic;
import * as joint from 'jointjs';
import * as _ from 'lodash';
import {forEach} from '@angular/router/src/utils/collection';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  @ViewChild('PaperContainer') PaperContainer: ElementRef;
  graph: joint.dia.Graph;
  paper: joint.dia.Paper;
  stencilGraph: joint.dia.Graph;
  stencilPaper: joint.dia.Paper;
  label: String;
  constructor() { }

  ngOnInit() {
    this.init();
  }

  a(){

  }

  init(){



    const graph = this.graph = new joint.dia.Graph;
    const paper = this.paper = new joint.dia.Paper({
        el: $('#paper'),
        width: 1000,
        height: 1000,
        gridSize: 10,
        drawGrid: true,
        model: graph,
        interactive: { labelMove: true },
        defaultLink: new joint.dia.Link({
          router: {
            name: 'orthogonal'
          },
          connector: {
            name: 'normal'
          },
          attrs: {
            '.marker-source': {
              d: 'M 10 0 L 0 5 L 10 10 z',
              stroke: 'transparent',
              fill: '#222138',
              transform: 'scale(0.001)'
            },
            '.marker-target': {
              d: 'M 10 0 L 0 5 L 10 10 z',
              stroke: 'transparent',
              fill: '#222138',
              transform: 'scale(1)'
            },
            '.connection': {
              stroke: '#222138',
              strokeDasharray: '0',
              strokeWidth: 1,
              fill: 'none'
            },
            '.connection-wrap': {
              fill: 'none'
            }
          }})
      });

    const stencilGraph = this.stencilGraph = new joint.dia.Graph;

    const stencilPaper = this.stencilPaper = new joint.dia.Paper({
        el: $('#stencil'),
        height: 60,
        width: 600,
        model: stencilGraph,
        interactive: false
      });



    var r1 = new joint.shapes.basic.Rect({
      position: {
        x: 10,
        y: 10
      },
      size: {
        width: 100,
        height: 40
      },
      attrs: {
        rect: {
          fill: '#ffffff',
          stroke: '#000000',
        },
        text: { text: 'Element'}
      }
    });

    var r2 = new joint.shapes.basic.Rhombus({
      position: {
        x: 120,
        y: 10
      },
      size: {
        width: 40,
        height: 40
      },
      attrs: {
        path: {
          fill: '#ffffff',
          stroke: '#000000',
        }
      }
    });

    var r3 = new joint.shapes.basic.Path({
      size: {
        width: 100,
        height: 40
      },
      position: {
        x: 170,
        y: 10
      },
      attrs: {
        path: {
          fill: '#ffffff',
          stroke: '#000000',
          d: 'M80,40H0V0h80V40z M10,0v40 M70,40V0'
        }
      }
    });

    var s1 = new joint.shapes.basic.Rect({
      position: {
        x: 280,
        y: 10
      },
      size: {
        width: 100,
        height: 40
      },
      attrs: {
        rect: {
          fill: '#ffffff',
          stroke: '#000000',
          rx: 30,
          ry: 30
        },
        text: { text: 'Start'}
      }
    });

    var s2 = new joint.shapes.basic.Rect({
      position: {
        x: 390,
        y: 10
      },
      size: {
        width: 100,
        height: 40
      },
      attrs: {
        rect: {
          fill: '#ffffff',
          stroke: '#000000',
          rx: 30,
          ry: 30
        },
        text: { text: 'End'}
      }
    });

    stencilGraph.addCells([r1, r2, r3, s1, s2]);

    stencilPaper.on('cell:pointerdown', function(cellView, e, x, y) {
      // const bodySelector = $('body');
      // const flyPaperSelector = $('#flyPaper');

      $('body').append('<div id="flyPaper" style="position:fixed;z-index:100;opacity:.7;pointer-event:none;"></div>');
      const flyGraph = new joint.dia.Graph,
        flyPaper = new joint.dia.Paper({
          el: $('#flyPaper'),
          model: flyGraph,
          width: 100,
          height: 40,
          interactive: false
        }),
        flyShape = cellView.model.clone(),
        pos = cellView.model.position(),
        offset = {
          x: x - pos.x,
          y: y - pos.y
        };

      flyShape.position(0, 0);
      flyGraph.addCell(flyShape);
      $('#flyPaper').offset({
        left: e.pageX - offset.x,
        top: e.pageY - offset.y
      });
      $('body').on('mousemove.fly', function(e) {
        $('#flyPaper').offset({
          left: e.pageX - offset.x,
          top: e.pageY - offset.y
        });
      });
      $('body').on('mouseup.fly', function(e) {
        let x = e.pageX,
          y = e.pageY,
          target = paper.$el.offset();

        if (x > target.left && x < target.left + paper.$el.width() && y > target.top && y < target.top + paper.$el.height()) {
          let s = flyShape.clone();
          s.position(x - target.left - offset.x, y - target.top - offset.y);
          graph.addCell(s);
        }
        $('body').off('mousemove.fly').off('mouseup.fly');
        flyShape.remove();
        $('#flyPaper').remove();
      });
    });

    paper.on('cell:pointerclick', function (cellView, evt, x, y) {
      if(!cellView.model.isLink()){
        initInspector(cellView, evt);
      }
    });

    function initInspector(cellView, evt) {
      if($('.j-inspector')){
        $('.j-inspector').remove();
      }

      let CELL = cellView.model;
      let cellPos = CELL.get('position');
      let cellSize = CELL.get('size');
      const cellW = CELL.get('size').width;
      const cellH = CELL.get('size').height;

      let inspectorTool = document.createElement('div');
      inspectorTool.setAttribute('class', 'j-inspector');
      inspectorTool.setAttribute('cell-id', CELL.id);
      inspectorStyle('visible', cellPos.x-6, cellPos.y-6, cellSize.width+12, cellSize.height+12, 'transparent', '1px dashed #c6c7e2', 'grab');
      inspectorTool.innerHTML = `
          <div class="j-resize nw" data-position="top-left" style="position: absolute; width: 6px; height: 6px; left: -3px; top: -3px; background: #3c4260; cursor: nw-resize;"></div>
          <div class="j-resize n" data-position="top" style="position: absolute; width: 6px; height: 6px; left: 50%; top: -3px; margin-left: -3px; background: #3c4260; cursor: n-resize;"></div>
          <div class="j-resize ne" data-position="top-right" style="position: absolute; width: 6px; height: 6px; right: -3px; top: -3px; background: #3c4260; cursor: ne-resize;"></div>
          <div class="j-resize e" data-position="right" style="position: absolute; width: 6px; height: 6px; right: -3px; top: 50%; margin-top: -3px; background: #3c4260; cursor: e-resize;"></div>
          <div class="j-resize se" data-position="bottom-right" style="position: absolute; width: 6px; height: 6px; right: -3px; bottom: -3px; background: #3c4260; cursor: se-resize;"></div>
          <div class="j-resize s" data-position="bottom" style="position: absolute; width: 6px; height: 6px; left: 50%; bottom: -3px; margin-left: -3px; background: #3c4260; cursor: s-resize;"></div>
          <div class="j-resize sw" data-position="bottom-left" style="position: absolute; width: 6px; height: 6px; left: -3px; bottom: -3px; background: #3c4260; cursor: sw-resize;"></div>
          <div class="j-resize w" data-position="left" style="position: absolute; width: 6px; height: 6px; left: -3px; top: 50%; margin-top: -3px; background: #3c4260; cursor: w-resize;"></div>
          <div class="j-opt j-delete" data-option="delete" style="position:absolute; width: 20px; height: 20px; left: -23px; top: -23px; background: red; cursor: pointer;"></div>
          <div class="j-opt j-link" data-option="link" style="position:absolute; width: 20px; height: 20px; right: -23px; bottom: -23px; background: green; cursor: grabbing;"></div>
      `;

      if(CELL.get('type') !== 'basic.Path'){
        inspectorTool.innerHTML += `<div class="j-opt j-label" data-toggle="modal" data-target="#cellModal" data-option="label" style="position:absolute; width: 20px; height: 20px; top: -23px; right: -23px; background: blue; cursor: pointer;"></div>`;
      }

      $('#paper').append(inspectorTool);

      let draggable = false;
      $('.j-inspector').on({
        'mousedown.j-inspector': cellOnDragStart,
        'mousemove.j-inspector': cellOnDrag,
        'mouseup.j-inspector': cellOnDragEnd
      },
        {
        view: cellView,
        paper: paper
        });

      function cellOnDragStart(evt) {
        if(inspectorTool.getAttribute('cell-id') == CELL.id && evt.target.getAttribute('class') == inspectorTool.getAttribute('class')){
          draggable = true;
          let p = evt.data.paper.snapToGrid({
            x: evt.clientX,
            y: evt.clientY
          });
          evt.data.view.pointerdown(evt, p.x, p.y);
        }
      }

      function cellOnDrag(evt) {
        if(draggable){
          let p = evt.data.paper.snapToGrid({
            x: evt.clientX,
            y: evt.clientY
          });
          if(p.x < 0 || p.y < 0){
            return;
          }

          evt.data.view.pointermove(evt, p.x, p.y);
          $('.j-inspector').children().css('visibility', 'hidden');
          inspectorTool.setAttribute('style', 'position: absolute; left:'+ (p.x-250) +'px; top:'+ (p.y-250)+'px; width:500px; height:500px; background: transparent; cursor: move;');
        }
      }

      function cellOnDragEnd(evt) {
        draggable = false;
        evt.data.view.pointerup(evt);
        $('.j-inspector').children().css('visibility', 'visible');
        inspectorTool.setAttribute('style', 'z-index: 1000; position: absolute; left:'+ (CELL.get('position').x-6)+'px; top:'+ (CELL.get('position').y-6)+'px; width:'+(CELL.get('size').width+12)+'px; height:'+(CELL.get('size').height+12)+'px; background: transparent; border: 1px dashed #c6c7e2;');
      }

      let resizable = false;
      $('.j-resize').on({
        'mousedown.j-resize': resizeOnDragStart,
        'mousemove.j-resize': resizeOnDrag,
        'mouseup.j-resize': resizeOnDragEnd
      },
        {
          view: cellView,
          paper: paper,
          start: {x: evt.clientX, y: evt.clientY},
          cellSize: {width: cellW, height: cellH}
        });

      function resizeOnDragStart(evt) {
        evt.data.start = evt.data.paper.snapToGrid({
          x: evt.clientX,
          y: evt.clientY
        });
        $('.nw, .n, .ne, .e, .se, .s, .sw, .w').css('visibility', 'hidden');
        $(this).attr('style', 'position: absolute; left:'+ (evt.data.start.x-(CELL.get('position').x)-250) +'px; top:'+ (evt.data.start.y-(CELL.get('position').y)-250)+'px; width:500px; height:500px; background: transparent; cursor: move;');
        $('.j-opt').css('visibility', 'hidden');
        evt.data.cellSize = {width: CELL.get('size').width, height: CELL.get('size').height};
        resizable = true;
      }

      function resizeOnDrag(evt) {
        if(resizable){
          const position = evt.target.getAttribute('data-position');
          let p = evt.data.paper.snapToGrid({
            x: evt.clientX,
            y: evt.clientY
          });

          switch (position){
            case 'top-left':
            {
              let newWidth = (evt.data.cellSize.width) - p.x + evt.data.start.x;
              let newHeight = (evt.data.cellSize.height) - p.y + evt.data.start.y;
              inspectorStyle('visible', p.x-6, p.y-6, newWidth+12, newHeight+12, 'transparent', 'none', 'none');
              if(newWidth < 40 || newHeight < 40){
                newWidth = newWidth < 40 ? 40 : newWidth;
                newHeight = newHeight < 40 ? 40 : newHeight;
                CELL.resize(newWidth, newHeight, {direction: 'top-left'});
                inspectorStyle('visible', CELL.get('position').x-6, CELL.get('position').y-6, newWidth+12, newHeight+12, 'transparent', 'none', 'none');
              }
              $(this).attr('style', 'position: absolute; left:'+ (p.x-(CELL.get('position').x)-250) +'px; top:'+ (p.y-(CELL.get('position').y)-250)+'px; width:500px; height:500px; background: transparent; cursor: nw-resize;');
              CELL.resize(newWidth, newHeight, {direction: 'top-left'});
            }
              break;
            case 'top':
            {
              let newHeight = (evt.data.cellSize.height) - p.y + evt.data.start.y;
              inspectorStyle('visible', CELL.get('position').x-6, p.y-6, CELL.get('size').width+12, newHeight+12, 'transparent', 'none', 'none');
              if(newHeight < 40){
                newHeight = newHeight < 40 ? 40 : newHeight;
                CELL.resize(cellW, newHeight, {direction: 'top'});
                inspectorStyle('visible', CELL.get('position').x-6, CELL.get('position').y-6, CELL.get('size').width+12, newHeight+12, 'transparent', 'none', 'none');
              }
              $(this).attr('style', 'position: absolute; left:'+ (p.x-(CELL.get('position').x)-250) +'px; top:'+ (p.y-(CELL.get('position').y)-250)+'px; width:500px; height:500px; background: transparent; cursor: n-resize;');
              CELL.resize(cellW, newHeight, {direction: 'top'});
            }
              break;
            case 'top-right':
            {
              let newWidth = (evt.data.cellSize.width) + p.x - evt.data.start.x;
              let newHeight = (evt.data.cellSize.height) - p.y + evt.data.start.y;
              inspectorStyle('visible', CELL.get('position').x-6, CELL.get('position').y-6, newWidth+12, newHeight+12, 'transparent', 'none', 'none');
              if(newWidth < 40 || newHeight < 40){
                newWidth = newWidth < 40 ? 40 : newWidth;
                newHeight = newHeight < 40 ? 40 : newHeight;
                CELL.resize(newWidth, newHeight, {direction: 'top-right'});
                inspectorStyle('visible', CELL.get('position').x-6, CELL.get('position').y-6, newWidth+12, newHeight+12, 'transparent', 'none', 'none');
              }
              $(this).attr('style', 'position: absolute; left:'+ (p.x-(CELL.get('position').x)-250) +'px; top:'+ (p.y-(CELL.get('position').y)-250)+'px; width:500px; height:500px; background: transparent; cursor: ne-resize;');
              CELL.resize(newWidth, newHeight, {direction: 'top-right'});
            }
              break;
            case 'right':
            {
              let newWidth = (evt.data.cellSize.width) + p.x - evt.data.start.x;
              inspectorStyle('visible', CELL.get('position').x-6, CELL.get('position').y-6, newWidth+12, CELL.get('size').height+12, 'transparent', 'none', 'none');
              if(newWidth < 40){
                newWidth = newWidth < 40 ? 40 : newWidth;
                CELL.resize(newWidth, cellH, {direction: 'right'});
                inspectorStyle('visible', CELL.get('position').x-6, CELL.get('position').y-6, newWidth+12, CELL.get('size').height+12, 'transparent', 'none', 'none');
              }
              $(this).attr('style', 'position: absolute; left:'+ (p.x-(CELL.get('position').x)-250) +'px; top:'+ (p.y-(CELL.get('position').y)-250)+'px; width:500px; height:500px; background: transparent; cursor: e-resize;');
              CELL.resize(newWidth, cellH, {direction: 'right'});
            }
              break;
            case 'bottom-right':
            {
              let newWidth = (evt.data.cellSize.width) + p.x - evt.data.start.x;
              let newHeight = (evt.data.cellSize.height) + p.y - evt.data.start.y;
              inspectorStyle('visible', CELL.get('position').x-6, CELL.get('position').y-6, newWidth+12, newHeight+12, 'transparent', 'none', 'none');
              if(newWidth < 40 || newHeight < 40){
                newWidth = newWidth < 40 ? 40 : newWidth;
                newHeight = newHeight < 40 ? 40 : newHeight;
                CELL.set('size', {width: newWidth, height: newHeight });
                inspectorStyle('visible', CELL.get('position').x-6, CELL.get('position').y-6, newWidth+12, newHeight+12, 'transparent', 'none', 'none');
                return;
              }
              $(this).attr('style', 'position: absolute; left:'+ (p.x-(CELL.get('position').x)-250) +'px; top:'+ (p.y-(CELL.get('position').y)-250)+'px; width:500px; height:500px; background: transparent; cursor: se-resize;');
              CELL.resize(newWidth, newHeight, {direction: 'bottom-right'});
            }
              break;
            case 'bottom':
            {
              let newHeight = (evt.data.cellSize.height) + p.y - evt.data.start.y;
              inspectorStyle('visible', CELL.get('position').x-6, CELL.get('position').y-6, CELL.get('size').width+12, newHeight+12, 'transparent', 'none', 'none');
              if(newHeight < 40){
                newHeight = newHeight < 40 ? 40 : newHeight;
                CELL.resize(cellW, newHeight, {direction: 'bottom'});
                inspectorStyle('visible', CELL.get('position').x-6, CELL.get('position').y-6, CELL.get('size').width+12, newHeight+12, 'transparent', 'none', 'none');
              }
              $(this).attr('style', 'position: absolute; left:'+ (p.x-(CELL.get('position').x)-250) +'px; top:'+ (p.y-(CELL.get('position').y)-250)+'px; width:500px; height:500px; background: transparent; cursor: s-resize;');
              CELL.resize(cellW, newHeight, {direction: 'bottom'});
            }
              break;
            case 'bottom-left':
            {
              let newWidth = (evt.data.cellSize.width) - p.x + evt.data.start.x;
              let newHeight = (evt.data.cellSize.height) + p.y - evt.data.start.y;
              inspectorStyle('visible', p.x-6, CELL.get('position').y-6, newWidth+12, newHeight+12, 'transparent', 'none', 'none');
              if(newWidth < 40 || newHeight < 40){
                newWidth = newWidth < 40 ? 40 : newWidth;
                newHeight = newHeight < 40 ? 40 : newHeight;
                CELL.resize(newWidth, newHeight, {direction: 'bottom-left'});
                inspectorStyle('visible', CELL.get('position').x-6, CELL.get('position').y-6, newWidth+12, newHeight+12, 'transparent', 'none', 'none');
                return;
              }
              $(this).attr('style', 'position: absolute; left:'+ (p.x-(CELL.get('position').x)-250) +'px; top:'+ (p.y-(CELL.get('position').y)-250)+'px; width:500px; height:500px; background: transparent; cursor: sw-resize;');
              CELL.resize(newWidth, newHeight, {direction: 'bottom-left'});
            }
              break;
            case 'left':
            {
              let newWidth = (evt.data.cellSize.width) - p.x + evt.data.start.x;
              inspectorStyle('visible', p.x-6, CELL.get('position').y-6, newWidth+12, CELL.get('size').height+12, 'transparent', 'none', 'none');
              if(newWidth < 40){
                newWidth = newWidth < 40 ? 40 : newWidth;
                CELL.resize(newWidth, cellH, {direction: 'left'});
                inspectorStyle('visible', CELL.get('position').x-6, CELL.get('position').y-6, newWidth+12, CELL.get('size').height+12, 'transparent', 'none', 'none');
                return;
              }
              $(this).attr('style', 'position: absolute; left:'+ (p.x-(CELL.get('position').x)-250) +'px; top:'+ (p.y-(CELL.get('position').y)-250)+'px; width:500px; height:500px; background: transparent; cursor: w-resize;');
              CELL.resize(newWidth, cellH, {direction: 'left'});
            }
              break;
            default:
              break;
          }
        }
      }

      function resizeOnDragEnd(evt) {
        resizable = false;
        evt.data.view.pointerup(evt);
        evt.data.cellSize.width = CELL.get('size').width;
        evt.data.cellSize.height = CELL.get('size').height;
        inspectorStyle('visible', CELL.get('position').x-6, CELL.get('position').y-6, CELL.get('size').width+12, CELL.get('size').height+12, 'transparent', '1px dashed #c6c7e2', 'grab');
        $('.j-opt').css('visibility', 'visible');
        $('.nw').attr('style', 'position: absolute; width: 6px; height: 6px; left: -3px; top: -3px; background: #3c4260; cursor: nw-resize;');
        $('.n').attr('style', 'position: absolute; width: 6px; height: 6px; left: 50%; top: -3px; margin-left: -3px; background: #3c4260; cursor: n-resize;');
        $('.ne').attr('style', 'position: absolute; width: 6px; height: 6px; right: -3px; top: -3px; background: #3c4260; cursor: ne-resize;');
        $('.e').attr('style', 'position: absolute; width: 6px; height: 6px; right: -3px; top: 50%; margin-top: -3px; background: #3c4260; cursor: e-resize;');
        $('.se').attr('style', 'position: absolute; width: 6px; height: 6px; right: -3px; bottom: -3px; background: #3c4260; cursor: se-resize;');
        $('.s').attr('style', 'position: absolute; width: 6px; height: 6px; left: 50%; bottom: -3px; margin-left: -3px; background: #3c4260; cursor: s-resize;');
        $('.sw').attr('style', 'position: absolute; width: 6px; height: 6px; left: -3px; bottom: -3px; background: #3c4260; cursor: sw-resize;');
        $('.w').attr('style', 'position: absolute; width: 6px; height: 6px; left: -3px; top: 50%; margin-top: -3px; background: #3c4260; cursor: w-resize;');
      }

      function inspectorStyle(visibility, left, top, width, height, background, border, cursor) {
        inspectorTool.setAttribute('style', `z-index: 1000;visibility: ${visibility}; position: absolute; left: ${left}px; top: ${top}px; width: ${width}px; height: ${height}px; background: ${background}; border: ${border}; cursor: ${cursor}`);
      }

      $('.j-delete').on({
        'click.j-delete' : deleteOnClick
      },
      {
        view: cellView,
        graph: graph
      });

      function deleteOnClick(evt){
        evt.data.graph.removeCells(evt.data.graph.getCell(CELL.id));
        $('.j-inspector').remove();
      }

      let linking = false;
      $('.j-link').on({
        'mousedown.j-link': linkOnClick
      },{
        paper: paper,
        graph: graph,
        start: {x: evt.clientX, y: evt.clientY}
      });

      function linkOnClick(evt) {
        linking = true;
          evt.data.start = evt.data.paper.snapToGrid({
            x: evt.clientX,
            y: evt.clientY
          });
          $('.j-inspector').remove();

          let linkView = evt.data.paper.getDefaultLink()
            .set({
              'source': { id: CELL.id },
              'target': { x: evt.data.start.x, y: evt.data.start.y }
            })
            .addTo(evt.data.paper.model)
            .findView(evt.data.paper);

            linkView.startArrowheadMove('target');

            $(document).on({
              'mousemove.example': onDrag,
              'mouseup.example': onDragEnd
            }, {
              view: linkView,
              paper: paper
            });


            function onDrag(evt) {
              let p = evt.data.paper.snapToGrid({
                x: evt.clientX,
                y: evt.clientY
              });
              evt.data.view.pointermove(evt, p.x, p.y);
            }

            function onDragEnd(evt) {
              evt.data.view.pointerup(evt);
              linking = false;
              $(document).off('.example');
            }
      }

      $('.j-label').on({
        'click.j-label': LabelOnClick
      },{
        paper: paper,
        graph: graph
      });

      function LabelOnClick() {
        if(CELL.id = inspectorTool.getAttribute('cell-id')){
          $('#saveElement').attr('cell-id', CELL.id);
          if(CELL.get('attrs').text.text.length > 0){
            $('#cellId').val(CELL.get('attrs').text.text);
          }else{
            $('#cellId').val('');
          }
        }
      }

      $('#saveElement').on('click', function () {
        if(CELL.id == $('#saveElement').attr('cell-id')) {
          CELL.attr('text/text', $('#cellId').val());
        }
      });

    }

    let scrollable = false;
    $('#ps').on({
      'mousedown.j-ps': psOnDragStart,
      'mousemove.j-ps': psOnDrag,
      'mouseup.j-ps': psOnDragEnd
    },{
      paper: paper,
      start: {},
      scrollXY: {}
    });

    function psOnDragStart(evt){
      if((evt.target.getAttribute('id') == $('#psi').attr('id')) || (evt.target.getAttribute('id') == $('#v-2').attr('id'))){
        evt.data.start = {x: evt.clientX, y: evt.clientY};
        evt.data.scrollXY = {left: $('#ps').scrollLeft(), top: $('#ps').scrollTop()};
        scrollable = true;
      }
    }

    function psOnDrag(evt){
      if(scrollable){
        $('#ps').scrollLeft(evt.data.scrollXY.left + (evt.data.start.x - evt.clientX));
        $('#ps').scrollTop(evt.data.scrollXY.top + (evt.data.start.y - evt.clientY));
      }
    }

    function psOnDragEnd(evt){
      scrollable = false;
    }

    paper.on('blank:pointerclick blank:pointerdown', function () {
      if($('.j-inspector')){
        $('.j-inspector').remove();
      }
    });

    paper.on('link:pointerdown link:mousemove', function () {
      if($('.j-inspector')){
        $('.j-inspector').remove();
      }
      if($('.j-link-option')){
        $('.j-link-option').remove();
      }
    });

    paper.on('link:mouseenter', function (cellView, evt) {
      if(cellView.model.isLink()){
          if($('.j-link-option')){
            $('.j-link-option').remove();
          }
          let lenghtTotal = cellView._V.connection.node.getTotalLength();
          let Point = cellView._V.connection.node.getPointAtLength(lenghtTotal - (cellView.options.linkToolsOffset/2) - 10);
          initLinkInspector(cellView, Point);
      }
    });


    function initLinkInspector(cellView, Point){
      let cell = cellView.model;
      let p = Point;
      let linkInspector = document.createElement('div');
      linkInspector.setAttribute('data-toggle', 'modal');
      linkInspector.setAttribute('data-target', '#labelModal');
      linkInspector.setAttribute('link-id',cell.id);
      linkInspector.setAttribute('class', 'j-link-option');
      linkInspector.setAttribute('style', 'width: 20px; height: 20px; position: absolute; left:'+ (p.x-10)+'px; top: '+ (p.y-10)+'px; background: red;');
      $('#paper').append(linkInspector);

      $('.j-link-option').on({
        'click.j-link-option': addLinkLabelClick,
        'mouseleave.j-link-option': removeLinkInspector
      },{
        view: cellView,
        paper: paper
      });

      function addLinkLabelClick(evt) {
        if(cell.id == linkInspector.getAttribute('link-id')){
          $('#saveLabel').attr('link-id', cell.id);
          if(cell.label(0)){
            if(cell.label(0).attrs.text.text.length > 0){
              $('#labelId').val(cell.label(0).attrs.text.text);
            }else{
              $('#labelId').val('');
            }

          }else {
            $('#labelId').val('');
          }
        }
      }

      $('#saveLabel').on('click', function () {
        if(cell.id == $('#saveLabel').attr('link-id')) {
          cell.label(0, {
            attrs: {
              text: {
                text: $('#labelId').val(),
                fill: 'white',
                fontFamily: 'sans-serif'
              },
              rect: {
                stroke: '#324D5C',
                strokeWidth: 20
              }
            }
          });
        }
      });

      function removeLinkInspector(evt) {
        $('.j-link-option').remove();
      }
    }

    paper.on('link:mouseout link:mouseleave', function (cellView, evt) {
      let Point = paper.snapToGrid({
        x: evt.clientX,
        y: evt.clientY
      });

      let lenghtTotal = cellView._V.connection.node.getTotalLength();
      let Point2 = cellView._V.connection.node.getPointAtLength(lenghtTotal - (cellView.options.linkToolsOffset/2) - 10);

      if((Math.abs(Point.x - Point2.x) < 20) && (Math.abs(Point.y - Point2.y) < 20)){
        return;
      }else{
        $('.j-link-option').remove();
      }
    });

    $('#ps').scrollTop(parseInt($('#paper').css('top')) - ($('#ps').height() / 4) );
    $('#ps').scrollLeft(parseInt($('#paper').css('left')) - ($('#ps').width() / 6));

    graph.on('remove', function(cell) {
      if (cell.isLink()) {
        if($('.j-link-option')){
          $('.j-link-option').remove();
        }
      }
    });

    paper.on('cell:pointermove', function (cellView, evt, x, y) {

      if((paper.getContentBBox().width + paper.getContentBBox().x) > paper.options.width - 30){
        paper.setDimensions(paper.options.width + 300, paper.options.height);
        console.log(paper);
      }

      if((paper.getContentBBox().height + paper.getContentBBox().y) > paper.options.height - 30){
        paper.setDimensions(paper.options.width, paper.options.height + 300);
      }
    });

  }


}
