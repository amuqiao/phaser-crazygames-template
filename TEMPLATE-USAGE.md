# Template Usage

本文只解决一个问题：如何从 `phaser-crazygames-template` 复制出一个新的真实游戏仓库。

复制完成后，这个文件可以从真实游戏仓库里删除，不需要改 README。

## 仓库模型

```text
phaser-crazygames-template
= 可复用工程模板
= 单独维护，不直接做真实上架游戏

pulse-dodger-v1
= 从模板复制出来的一款真实游戏
= 在这里修改玩法、素材、文案、metadata 和提交材料
```

模板仓库是模具，游戏仓库是产品。不要直接在模板仓库里开发并提交真实游戏。

## 创建新游戏仓库

以空仓库 `git@github.com:amuqiao/pulse-dodger-v1.git` 为例，直接执行：

```bash
cd /Users/admin/Code/Game

git clone git@github.com:amuqiao/pulse-dodger-v1.git

rsync -av \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='submissions' \
  --exclude='TEMPLATE-USAGE.md' \
  phaser-crazygames-template/ \
  pulse-dodger-v1/

cd pulse-dodger-v1

npm pkg set name="pulse-dodger-v1" description="Pulse Dodger v1"
npm install --package-lock-only
npm ci
npm run build
npm run portal:upload
```

如果这个文件已经复制到了真实游戏仓库，确认上面的命令跑通后可以删除：

```bash
rm TEMPLATE-USAGE.md
```

## 第一批游戏专属修改

在复制出来的游戏仓库里，优先改这些地方：

```text
package.json              包名和描述
src/game/theme.ts         游戏标题、英文文案、颜色
src/game/keys.ts          storage keys，每款游戏必须唯一
src/game/core/RunState.ts 纯游戏规则
src/game/scenes/PlayScene.ts 实际 Phaser 玩法
materials/metadata.md     CrazyGames 提交元数据
materials/screenshots/    最终截图
materials/covers/         最终 cover
materials/videos/         preview video
```

## 提交前最小验证

```bash
npm run build
npm run preview
npm run portal:upload
npm run check:size
```

把 `submissions/portal-upload/` 里面的文件上传到 CrazyGames。不要上传 `submissions/archives/*.zip`，除非 Portal 明确要求上传 archive。
