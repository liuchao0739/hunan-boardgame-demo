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

import {native, sys} from "cc";

const {jsbBridgeWrapper} = native;

/**
 * 添加多平台适配类
 */
export class PlatformMgr {
    //实现单例
    //注意，MultiPlatform是要替换成你自己实现的子类 这里没有实际的作用
    private static _instance: PlatformMgr;

    public static get Inst(): PlatformMgr {
        if (!this._instance) {
            this._instance = new PlatformMgr();
        }
        return this._instance;
    }

    // if(window.JavascriptJavaBridge && cc.sys.os == cc.sys.OS_ANDROID){
    //     jsb.reflection = new JavascriptJavaBridge();
    //     cc.sys.capabilities["keyboard"] = true;
    // }
    // else if(window.JavaScriptObjCBridge && (cc.sys.os == cc.sys.OS_IOS || cc.sys.os == cc.sys.OS_OSX)){
    //     jsb.reflection = new JavaScriptObjCBridge();
    // }
    // 登录
    //第三方登陆
    public thirdPartyLogin() {
        if (sys.platform == sys.Platform.ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "StartWeiXin", "()V");
        } else if (sys.platform == sys.Platform.IOS) {
            console.log("thirdPartyLogin------>StartWeiXin");
            jsb.reflection.callStaticMethod("AppController", "StartWeiXin");
        } else {
            //
        }


        return false;

    }

    //初始化微信
    doWeChatCOnfig(appID: string, appSecret: string) {
        if (sys.platform == sys.Platform.ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "RegisterWeiXin", "(Ljava/lang/String;Ljava/lang/String;)V", appID, appSecret);
        }
        // else if (sys.platform == sys.IPHONE) {
        else if (sys.platform == sys.Platform.IOS) {
            jsb.reflection.callStaticMethod("AppController", "RegisterWeiXin:", appID, appSecret);
        } else {
            //随机数字写入缓存
        }
    }

    //微信分享
    startShare(content: string, title: string, Target: number) {
        if (sys.platform == sys.Platform.ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "startShare", "(Ljava/lang/String;Ljava/lang/String;I)V", content, title, Target);
        }
        // else if (sys.platform == sys.IPHONE) {
        else if (sys.platform == sys.Platform.IOS) {
            jsb.reflection.callStaticMethod("AppController", "startShare:", content, title, Target);
        } else {
            //随机数字写入缓存
        }
    }

    //获取机器码
    getUUID(): string {
        var uid = "";
        if (sys.isNative && sys.platform == sys.Platform.ANDROID) {
            uid = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getUUID", "()Ljava/lang/String;");
            console.log("getUUID------------------>", uid);
            if (!uid || "" == uid) {
                //随机数字写入缓存
                uid = sys.localStorage.getItem('randonUID');
                if (!uid) {
                    //获取时间
                    var date = new Date();
                    uid = Math.random() * date.getTime() + "";
                    sys.localStorage.setItem('randonUID', uid);
                }
            }
        } else if (sys.isNative && sys.platform == sys.Platform.IOS) {
            if ("" == uid) {
                //随机数字写入缓存
                uid = sys.localStorage.getItem('randonUID');
                if (!uid) {
                    //获取时间
                    var date = new Date();
                    uid = Math.random() * date.getTime() + "";
                    sys.localStorage.setItem('randonUID', uid);
                }
            }
        } else {
            //随机数字写入缓存
            uid = sys.localStorage.getItem('randonUID');
            if (!uid) {
                var date = new Date();
                uid = Math.random() * date.getTime() + "";
                sys.localStorage.setItem('randonUID', uid);
            }
        }
        return uid;
    }

    // 调用电话服务
    systemCall(szTel: string) {
        if (sys.platform == sys.Platform.ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "systemCall", "(Ljava/lang/String;)V", szTel);
        }
        // else if (sys.platform == sys.IPHONE) {
        else if (sys.platform == sys.Platform.IOS) {
            jsb.reflection.callStaticMethod("AppController", "systemCall:", szTel);
        }
    }


    // 复制到剪切板
    copyToClipboard(str: string) {
        if (sys.isBrowser) {
            var save = function (e) {
                e.clipboardData.setData('text/plain', str);
                e.preventDefault();
            }
            document.addEventListener('copy', save);
            document.execCommand('copy');
            document.removeEventListener('copy', save);

            // ExternalFun.getToastLayer().showToast(2, "复制成功！");
        } else if (sys.platform == sys.Platform.ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "copyToClipboard", "(Ljava/lang/String;)V", str);
            // ExternalFun.getToastLayer().showToast(2, "复制成功！");
        }
        // else if (sys.platform == sys.IPHONE) {
        else if (sys.platform == sys.Platform.IOS) {
            jsb.reflection.callStaticMethod("AppController", "copyToClipboard:", str);
            // ExternalFun.getToastLayer().showToast(2, "复制成功！");
        }
    }

    //截屏保存截图到手机
    saveImgToLacal(camera: Camera, width, height) {
        let node = new Node();
        node.setParent(director.getScene());
        // let camera1 = node.addComponent(Camera);

        // 设置你想要的截图内容的 cullingMask
        camera.cullingMask = 0xffffffff;

        // 新建一个 RenderTexture，并且设置 camera 的 targetTexture 为新建的 RenderTexture，这样 camera 的内容将会渲染到新建的 RenderTexture 中。
        let texture = new RenderTexture();

        // 如果截图内容中不包含 Mask 组件，可以不用传递第三个参数
        texture.initWithSize(width, height);
        camera.targetTexture = texture;

        // 渲染一次摄像机，即更新一次内容到 RenderTexture 中
        camera.render(undefined);

        // 这样我们就能从 RenderTexture 中获取到数据了
        let data = texture.readPixels();

        if (sys.isNative) {
            //保存
            var filePath = jsb.fileUtils.getWritablePath() + 'Image.png';
            jsb.saveImageData(data, width, height, filePath)

            PlatformMgr.getInstance().saveImgToSystemGallery(filePath, "Image.png");
        }
    }

    //下载图片到本地
    downFile2Local(url, fileName, callback) {
        if (sys.isNative) {

        }
    }

    //图片存储至系统相册
    saveImgToSystemGallery(filepath, filename) {
        if (sys.isNative && sys.platform == sys.Platform.ANDROID) {
            if (!jsb.fileUtils.isFileExist(filepath)) {
                return;
            }
            let isSave = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "saveImgToSystemGallery", "(Ljava/lang/String;Ljava/lang/String;)Z", filepath, filename);
            if (isSave) {
                // ExternalFun.getToastLayer().showToast(2, "图片已保存！");
            }
        } else if (sys.isNative && sys.platform == sys.Platform.IOS) {
            if (!jsb.fileUtils.isFileExist(filepath)) {
                return;
            }
            let isSave = jsb.reflection.callStaticMethod("AppController", "saveImgToSystemGallery:Filename:", filepath, filename);
            if (isSave) {
                // ExternalFun.getToastLayer().showToast(2, "图片已保存！");
            }
        }
    }

    //安装安装包
    installClient(filepath) {
        if (sys.isNative && sys.platform == sys.Platform.ANDROID) {
            if (!jsb.fileUtils.isFileExist(filepath)) {
                return;
            }
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "installClient", "(Ljava/lang/String;)Z", filepath);
        } else if (sys.isNative && sys.platform == sys.Platform.IOS) {
            if (!jsb.fileUtils.isFileExist(filepath)) {
                return;
            }
            jsb.reflection.callStaticMethod("AppController", "installClient:Filename:", filepath);
        }
    }
}

