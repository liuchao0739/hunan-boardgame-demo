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

import protocol from "../../protocols/protocol.js";
import {EProtocolID, queryProtocolConfig, IProtocolData} from "./protocol-configs";

export namespace ProtocolPacker {

    const PROTOCOL_HEADER_LENGTH = 14;
    const PROTOCOL_DATA_LENGTH_OFFSET = 10;

    export function pack<T extends EProtocolID>(protocolID: T, data: IProtocolData[T]['req']): ArrayBuffer {
        const encoder = queryProtocolConfig(protocolID)?.encoder;
        /** "buffer" here is a Buffer extends Uint8Array */
        const buffer = encoder?.encode?.(data).finish();
        const bufferLength = buffer?.length ?? 0;

        const dataView = new DataView(new ArrayBuffer(PROTOCOL_HEADER_LENGTH + bufferLength));
        /** protobuf length + offset */
        dataView.setUint32(0, bufferLength + PROTOCOL_DATA_LENGTH_OFFSET);
        /** protocol ID */
        dataView.setUint32(4, protocolID);
        /** serial number */
        dataView.setUint32(8, 0);
        /** status */
        dataView.setUint8(12, 0);
        /** check code */
        dataView.setUint8(13, 0);
        for (let index = 0; index < bufferLength; ++index) {
            dataView.setUint8(PROTOCOL_HEADER_LENGTH + index, buffer[index]);
        }

        return dataView.buffer;
    }

    export interface IProtocolResponse {
        id: EProtocolID,
        success: boolean,
        data?: object;
    };

    export function unpack(data: ArrayBuffer): IProtocolResponse | null {
        let response: IProtocolResponse | null = null;
        const dataLength = data.byteLength;
        if (dataLength >= PROTOCOL_HEADER_LENGTH) {
            const dataView = new DataView(data.slice(0, PROTOCOL_HEADER_LENGTH));
            const protocolID = dataView.getUint32(4);
            const messageLength = dataView.getUint32(0) - PROTOCOL_DATA_LENGTH_OFFSET;
            response = {
                id: protocolID,
                success: false,
            };
            if (messageLength >= 0 && dataLength >= PROTOCOL_HEADER_LENGTH + messageLength) {
                const status = dataView.getUint8(12);
                const buffer = new Uint8Array(data.slice(PROTOCOL_HEADER_LENGTH, PROTOCOL_HEADER_LENGTH + messageLength));
                if (status === 0) {
                    /* logical success */
                    const decoder = queryProtocolConfig(protocolID)?.decoder;
                    if (messageLength <= 0 && !decoder) {
                        /* empty data */
                        response.success = true;
                    } else if (decoder && decoder.decode) {
                        try {
                            response.data = decoder.decode(buffer);
                            response.success = true;
                        } catch (error) {
                            console.error(`[PROTOCOL-PACKER] decode message data of ${protocolID} failed: ${error}`);
                        }
                    } else {
                        console.error(`[PROTOCOL-PACKER] invalid decoder: decoder or decode method of ${protocolID} not found`);
                    }
                } else {
                    /* logical failure */
                    try {
                        const message = protocol.pb_common.pbError.decode(buffer);
                        console.log(`[PROTOCOL-PACKER] protocol ${protocolID} error: ${message.errCode}`);
                        response.data = message;
                    } catch (error) {
                        console.error(`[PROTOCOL-PACKER] decode error data of ${protocolID} failed: ${error}`);
                    }
                }
            } else {
                console.error(`[PROTOCOL-PACKER] invalid message data: incorrect length or some data lost`);
            }

            if (protocolID === EProtocolID.PUSH_INFO_CHANGE) {
                console.log(`[PROTOCOL-PACKER] transit data received`);
                if (response.success) {
                    const transitData = response.data as protocol.push.IInfoChange;
                    const originalProtocolID = transitData.opCode;
                    const originalProtocolData = transitData.data ?? new Uint8Array(0);

                    if (originalProtocolID !== null && originalProtocolID !== undefined) {
                        response.id = originalProtocolID;
                        response.success = false;

                        const decoder = queryProtocolConfig(originalProtocolID)?.decoder;
                        if (originalProtocolData.byteLength <= 0 && !decoder) {
                            response.data = undefined;
                            response.success = true;
                        } else if (decoder && decoder.decode) {
                            try {
                                response.data = decoder.decode(originalProtocolData);
                                response.success = true;
                            } catch (error) {
                                console.error(`[PROTOCOL-PACKER] decode message data of ${originalProtocolID} failed: ${error}`);
                            }
                        } else {
                            console.error(`[PROTOCOL-PACKER] invalid decoder: decoder or decode method of ${originalProtocolID} not found`);
                        }
                    }
                }
            }
        } else {
            console.error(`[PROTOCOL-PACKER] invalid message data: less than a header`);
        }
        return response;
    }

}