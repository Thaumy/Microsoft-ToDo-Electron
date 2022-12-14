# Microsoft-ToDo-Electron

Microsoft To Do Client in Electron

由于 Linux 上没有令我满意的 ToDo 应用，于是使用 Electron 包装了这个 Microsoft To Do 客户端，以提供一致的备忘体验。

<div align=center><img src="img.png" width="60%"></div>

## 构建

推荐使用 `yarn` :

```text
$ git clone https://github.com/Thaumy/Microsoft-ToDo-Electron.git
$ cd Microsoft-ToDo-Electron && yarn
$ yarn dist
```

默认编译目标为tar.gz。如果你需要其他类型的安装包，请修改 `package.json` 的 `build.linux.target` 节点，
详尽的Linux构建目标参见 [https://www.electron.build/configuration/linux](https://www.electron.build/configuration/linux)。

## 使用方法

1. 解压tar.gz包到你想要的安装位置
2. 运行 microsoft-todo-electron
3. 登录账号密码（如果你的设备可信，建议勾选记住用户）
4. enjoy!

第一次启动可能会比较慢，这是因为应用需要建立缓存。

如需更换账户信息，请执行以下命令（注意将`thaumy`替换为你的用户名）

`rm -rf /home/thaumy/.config/microsoft-todo-electron`

之后从 步骤2 继续即可。

## 高级设置

本应用支持基于CSS注入的主题支持。

若想配置主题，可编辑 `~/.config/microsoft-todo-electron/cfg` 下的 `theme.css` 和 `glob.css` 。  
其中，`theme.css` 受控于 `~/.config/microsoft-todo-electron/cfg/appConfig.json` 中的 `enableTheme` 选项。  
而 `glob.css` 是全局样式表，会在每次应用启动时应用。

> [cfg_example](./cfg_example) 文件夹下的 `theme.css` 是一个夜间主题的配置示例。

`~/.config/microsoft-todo-electron/cfg/appConfig.json` 中提供了一些设置选项：

* `width` 应用启动时的px宽度
* `height` 应用启动时的px高度
* `resizable` 是否允许以拖动的方式改变窗口大小
* `enableTheme` 是否启用 `theme.css` 样式

注意，每次应用启动时都会检查 `cfg` 下的配置选项，当无法发现配置文件时，应用将自动创建默认配置。  
所以，当你想清空登陆数据但保留应用配置时，请不要删除 `cfg` 及其下的任何内容。

## (optional)使用Nix进行包管理

Nix 是一种采用独特方法进行包管理和系统配置的工具，它能够提供可重现的构建和部署。
