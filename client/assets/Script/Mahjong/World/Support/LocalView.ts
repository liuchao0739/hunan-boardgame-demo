/****************************************************************************
 Copyright (c) Bit Technologies Inc.

 代码：https://github.com/openpokergame/PocketMahjongClient.git

 官网一：http://qipaiplay.com

 官网二：http://openpokergame.net

 玩法博客：http://www.xgeplayer.com

 email: openpokerorg@gmail.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

import {find, Vec3} from "cc";
import {PlayerMgr} from "../Entity/Player/Player";
import {SeatOrien} from "./SeatOrien";
import {WorldNode} from "./WorldNode";

// 本机视角。设置本机的视角后，其他玩家的显示才能确定。
export class LocalView {

    public static init(orien: SeatOrien) {
        console.log("oriend:", orien);

        OreinSeatIdx.createIns();

        // 设置桌子旋转
        WorldNode.ins.table.root.eulerAngles = ViewDataTableRataion.getAngles(orien);
    }

}

// 朝向与固定座位索引的关系。索引：0-3 下右上左
export class OreinSeatIdx {
    public static ins: OreinSeatIdx;

    // 桌位节点索引
    public oreinToSeatIdx = new Map<SeatOrien, Map<SeatOrien, number>>();

    public static createIns() {

        if (this.ins == null) {
            this.ins = new OreinSeatIdx();
        }

    }

    public constructor() {

        let mapping = new Map<SeatOrien, number>();
        this.oreinToSeatIdx.set(SeatOrien.East, mapping);
        mapping.set(SeatOrien.East, 0);
        mapping.set(SeatOrien.South, 1);
        mapping.set(SeatOrien.West, 2);
        mapping.set(SeatOrien.North, 3);

        mapping = new Map<SeatOrien, number>();
        this.oreinToSeatIdx.set(SeatOrien.South, mapping);
        mapping.set(SeatOrien.East, 3);
        mapping.set(SeatOrien.South, 0);
        mapping.set(SeatOrien.West, 1);
        mapping.set(SeatOrien.North, 2);

        mapping = new Map<SeatOrien, number>();
        this.oreinToSeatIdx.set(SeatOrien.West, mapping);
        mapping.set(SeatOrien.East, 2);
        mapping.set(SeatOrien.South, 3);
        mapping.set(SeatOrien.West, 0);
        mapping.set(SeatOrien.North, 1);

        mapping = new Map<SeatOrien, number>();
        this.oreinToSeatIdx.set(SeatOrien.North, mapping);
        mapping.set(SeatOrien.East, 1);
        mapping.set(SeatOrien.South, 2);
        mapping.set(SeatOrien.West, 3);
        mapping.set(SeatOrien.North, 0);

    }

    public getIdx(orien: SeatOrien): number {

        var localSeatOrein = PlayerMgr.ins.local.gameData.seatOrien;
        var idx = this.oreinToSeatIdx.get(localSeatOrein).get(orien);
        console.log("自己SeatOrein:", localSeatOrein, "他人orien:", orien, "idx:", idx);
        return idx;

    }

}

/*
    视图数据。用于实现：摄像机不变，旋转桌子。
    好处: Seat 节点数据不需要动态改变，可以预先固定好位置。例如：对家可能距离中心近一些。左右手牌距离远一些。左右手牌有特殊旋转避免太倾斜。

*/
export class ViewDataTableRataion {

    public static getAngles(orien: SeatOrien): Vec3 {

        var tableRotation = new Map<SeatOrien, Vec3>();
        tableRotation.set(SeatOrien.East, new Vec3(0, 0, 0));
        tableRotation.set(SeatOrien.South, new Vec3(0, -90, 0));
        tableRotation.set(SeatOrien.West, new Vec3(0, 180, 0));
        tableRotation.set(SeatOrien.North, new Vec3(0, 90, 0));

        return tableRotation.get(orien);
    }

}

// 3D 摄像机视角数据。用于设置摄像机位置和旋转的方法切换东南西北视角。0 本机。逆时针。
export class ViewDataCam {

    // 位置列表
    public static posList: Array<Vec3> = null;
    // 旋转列表
    public static eaList: Array<Vec3> = null;

    public static init() {

        this.posList = new Array<Vec3>();
        this.eaList = new Array<Vec3>();

        var cam = find("Main Camera");

        var pos = cam.position;
        var ea = cam.eulerAngles;
        this.posList.push(pos);
        this.eaList.push(ea);

        var pos2 = new Vec3(pos.z, pos.y, 0);
        var ea2 = new Vec3(ea.x, 90, ea.z);
        this.posList.push(pos2);
        this.eaList.push(ea2);

        pos2 = new Vec3(pos.x, pos.y, -pos.z);
        ea2 = new Vec3(ea.x, 180, ea.z);
        this.posList.push(pos2);
        this.eaList.push(ea2);

        var pos2 = new Vec3(-pos.z, pos.y, 0);
        ea2 = new Vec3(ea.x, -90, ea.z);
        this.posList.push(pos2);
        this.eaList.push(ea2);

        cam.position = this.posList[2];
        cam.eulerAngles = this.eaList[2];
    }

}