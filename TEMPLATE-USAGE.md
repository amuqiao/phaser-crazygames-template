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

只改顶部变量区，然后整段复制粘贴执行：

```bash
GAME_ROOT="/Users/admin/Code/Game"
TEMPLATE_DIR="phaser-crazygames-template"

GAME_DIR="pulse-dodger-v1"
GAME_REPO="git@github.com:amuqiao/pulse-dodger-v1.git"
PACKAGE_NAME="pulse-dodger-v1"
GAME_DESCRIPTION="Pulse Dodger v1"

cd "$GAME_ROOT"

git clone "$GAME_REPO"

rsync -av \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='submissions' \
  --exclude='TEMPLATE-USAGE.md' \
  "$TEMPLATE_DIR"/ \
  "$GAME_DIR"/

cd "$GAME_DIR"

npm pkg set name="$PACKAGE_NAME" description="$GAME_DESCRIPTION"
npm install --package-lock-only
npm ci
npm run build
npm run portal:upload
```

变量怎么改：

| 变量 | 改什么 |
| --- | --- |
| `GAME_ROOT` | 模板仓库和新游戏仓库所在目录。 |
| `TEMPLATE_DIR` | 模板目录名，默认是 `phaser-crazygames-template`。 |
| `GAME_DIR` | 新游戏目录名，通常等于仓库名。 |
| `GAME_REPO` | 新游戏空仓库地址。 |
| `PACKAGE_NAME` | `package.json` 里的包名，通常等于 `GAME_DIR`。 |
| `GAME_DESCRIPTION` | `package.json` 里的描述。 |

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

## 新游戏初始化清单

复制模板后，用这份清单把“模板身份”替换成“游戏身份”：

| 文件或目录 | 必改内容 | 原因 |
| --- | --- | --- |
| `package.json` | `name`、`description` | 构建产物、文档和提交记录要指向真实游戏。 |
| `src/game/keys.ts` | `STORAGE_KEYS` | 每款游戏必须有唯一存档 key，避免同域调试时互相覆盖。 |
| `src/game/theme.ts` | 标题、英文 UI 文案、颜色 | 默认文案只是 demo，不能带去公开审核。 |
| `src/game/core/RunState.ts` | 玩法规则、结算字段、进度保存语义 | 纯规则层必须表达真实游戏，而不是模板 demo。 |
| `src/game/scenes/contracts.ts` | 场景 payload 类型 | 新增场景或结算字段时，让跳转数据继续受 TypeScript 保护。 |
| `src/game/scenes/PlayScene.ts` | 实际玩法编排 | demo 只证明工程链路可运行。 |
| `materials/metadata.md` | 商店标题、简介、说明、标签 | Portal 提交前不能保留 TODO 或模板描述。 |
| `materials/screenshots/` | 最终截图 | 必须反映真实游戏画面。 |
| `materials/covers/` | 横版、竖版、方形 cover | CrazyGames 展示素材不能使用模板占位。 |
| `materials/videos/` | preview video | 视频必须来自真实玩法。 |
| `docs/asset-license.csv` | 素材来源和授权 | 审核和后续维护都需要可追溯。 |
| `docs/submission-log.csv` | 每次上传记录 | 记录版本、上传时间、审核反馈和修复动作。 |

脚本扩展按 [scripts/README.md](scripts/README.md) 的范式做：新增 leaf script，再接入 `scripts/run.sh`，最后按需加 npm alias。不要直接把长命令堆进 `package.json`。

## 提交前最小验证

```bash
npm run build
npm run preview
npm run portal:upload
npm run check:size
```

把 `submissions/portal-upload/` 里面的文件上传到 CrazyGames。不要上传 `submissions/archives/*.zip`，除非 Portal 明确要求上传 archive。
