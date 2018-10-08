import ChessBank from '../chess/ChessBank.js';
import GetChessData from '../chess/GetChessData.js';
import GetChessUID from '../chess/GetChessUID.js';
import BoardData from './BoardData.js';

import TileXYToWorldX from './worldposition/TileXYToWorldX.js';
import TileXYToWorldY from './worldposition/TileXYToWorldY.js';
import WorldXYToTileX from './worldposition/WorldXYToTileX.js';
import WorldXYToTileY from './worldposition/WorldXYToTileY.js';
import GridAlign from './worldposition/GridAlign.js';
import ContainPoint from './worldposition/ContainPoint.js';
import SetBoardWidth from './SetBoardWidth.js';
import SetBoardHeight from './SetBoardHeight.js';
import AddChess from './AddChess.js';
import RemoveChess from './RemoveChess.js';
import RemoveAllChess from './RemoveAllChess.js';
import SwapChess from './SwapChess.js';
import Contains from './tileposition/Contains.js';
import ForEachTileXY from './tileposition/ForEachTileXY.js';
import GetWrapTileX from './tileposition/GetWrapTileX.js';
import GetWrapTileY from './tileposition/GetWrapTileY.js';
import TileXYZToChess from './tileposition/TileXYZToChess.js';
import TileXYToChessArray from './tileposition/TileXYToChessArray.js';
import TileZToChessArray from './tileposition/TileZToChessArray.js';
import TileXYArrayToChessArray from './tileposition/TileXYArrayToChessArray.js';
import ChessToTileXYZ from './tileposition/ChessToTileXYZ.js';
import GetAllChess from './GetAllChess.js';
import GetEmptyTileXYArray from './empty/GetEmptyTileXYArray.js';
import GetRandomEmptyTileXY from './empty/GetRandomEmptyTileXY.js';
import GetNeighborTileXY from './neighbors/GetNeighborTileXY.js';
import GetNeighborChess from './neighbors/GetNeighborChess.js';
import GetNeighborTileDirection from './neighbors/GetNeighborTileDirection.js';
import GetNeighborChessDirection from './neighbors/GetNeighborChessDirection.js';
import AreNeighbors from './neighbors/AreNeighbors.js';
import GetOppositeDirection from './GetOppositeDirection.js';
import GetDistance from './GetDistance.js';
import HasBlocker from './blocker/HasBlocker.js';
import HasEdgeBlocker from './blocker/HasEdgeBlocker.js';
import Offset from './Offset.js';
import SetInteractive from './SetInteractive.js';
import GetGridPoints from './GetGridPoints.js';
import GetGridPolygon from './GetGridPolygon.js';

import DefaultGrids from '../grid/index.js';

const EE = Phaser.Events.EventEmitter;
const GetValue = Phaser.Utils.Objects.GetValue;
const IsPlainObject = Phaser.Utils.Objects.IsPlainObject;

class Board extends EE {
    constructor(scene, config) {
        super();

        this.scene = scene;
        this.boardData = new BoardData();
        this.resetFromJSON(config);
        this.boot();
    }

    resetFromJSON(o) {
        this.setGrid(GetValue(o, 'grid', undefined));
        this.setWrapMode(GetValue(o, 'wrap', false));
        this.setInfinityBoard(GetValue(o, 'inifinity', false));
        this.setBoardWidth(GetValue(o, 'width', 0));
        this.setBoardHeight(GetValue(o, 'height', 0));
        return this;
    }

    boot() {
        this.scene.events.on('destroy', this.destroy, this);
    }

    shutdown() {
        this.removeAllChess(true, true);
        super.shutdown();
        this.boardData.shutdown();

        this.scene = undefined;
        this.boardData = undefined;
        return this;
    }

    destroy() {
        this.emit('destroy');
        this.shutdown();
        return this;
    }

    setGrid(grid) {
        if (IsPlainObject(grid)) {
            var config = grid;
            var gridType = GetValue(config, 'gridType', 'quadGrid');
            var grid = new DefaultGrids[gridType](config);
        }
        this.grid = grid;
        return this;
    }

    setWrapMode(mode) {
        if (mode === undefined) {
            mode = true;
        }
        this.wrapMode = mode;
        return this;
    }

    setInfinityBoard(mode) {
        if (mode === undefined) {
            mode = true;
        }
        this.infinityMode = mode;
        return this;
    }

    setBoardSize(width, height) {
        this.setBoardWidth(width);
        this.setBoardHeight(height);
        return this;
    }

    exists(gameObject) {
        // game object or uid
        return this.boardData.exists(this.getChessUID(gameObject));
    }

    uidToChess(uid) {
        if (uid == null) {
            return null;
        } else {
            // single uid
            if (!this.boardData.exists(uid)) {
                return null;
            }
            return ChessBank.get(uid).parent;
        }
    }

    uidArrayToChess(uid, out) {
        if (out === undefined) {
            out = [];
        }
        var uidArray = uid;
        for (var i = 0, cnt = uidArray.length; i < cnt; i++) {
            uid = uidArray[i];
            if (!this.boardData.exists(uid)) {
                continue;
            }
            out.push(ChessBank.get(uid));
        }
        return out;
    }

    get chessCount() {
        return this.boardData.chessCount;
    }
}

var methods = {
    tileXYToWorldX: TileXYToWorldX,
    tileXYToWorldY: TileXYToWorldY,
    worldXYToTileX: WorldXYToTileX,
    worldXYToTileY: WorldXYToTileY,
    setBoardWidth: SetBoardWidth,
    setBoardHeight: SetBoardHeight,
    getChessData: GetChessData,
    getChessUID: GetChessUID,
    addChess: AddChess,
    gridAlign: GridAlign,
    removeChess: RemoveChess,
    removeAllChess: RemoveAllChess,
    moveChess: AddChess,
    swapChess: SwapChess,
    forEachTileXY: ForEachTileXY,
    contains: Contains,
    containPoint: ContainPoint,
    getWrapTileX: GetWrapTileX,
    getWrapTileY: GetWrapTileY,
    tileXYZToChess: TileXYZToChess,
    tileXYToChessArray: TileXYToChessArray,
    tileZToChessArray: TileZToChessArray,
    tileXYArrayToChess: TileXYArrayToChessArray,
    chessToTileXYZ: ChessToTileXYZ,
    getAllChess: GetAllChess,
    getEmptyTileXYArray: GetEmptyTileXYArray,
    getRandomEmptyTileXY: GetRandomEmptyTileXY,
    getNeighborTileXY: GetNeighborTileXY,
    getNeighborChess: GetNeighborChess,
    getNeighborTileDirection: GetNeighborTileDirection,
    getNeighborChessDirection: GetNeighborChessDirection,
    areNeighbors: AreNeighbors,
    getOppositeDirection: GetOppositeDirection,
    getDistance: GetDistance,
    hasBlocker: HasBlocker,
    hasEdgeBlocker: HasEdgeBlocker,
    offset: Offset,
    setInteractive: SetInteractive,
    getGridPoints: GetGridPoints,
    getGridPolygon: GetGridPolygon,
}
Object.assign(
    Board.prototype,
    methods
);

export default Board;