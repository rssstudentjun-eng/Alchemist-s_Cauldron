# Alchemist-s_Cauldron

[RS School assignment](https://github.com/rolling-scopes-school/qualifying-stage/blob/main/tasks/game-alchemists-cauldron/README.md)

Mix ingredients to match the recipe's Temperature, Density and Magic Power before time or lives run out.

Implemented: three difficulties, limited ingredient stock, recipe checks, parameter bars, pause, auto-save and Continue Game, a Top-10 leaderboard for each difficulty, drag and drop, tooltips, reactions, Pour Out and CSS animations.

Choose a difficulty in Settings and press Start Game. Click or drag ingredients into the cauldron.

## Keyboard controls

- `B` - brew the current mixture.
- `O` - pour out the mixture. Costs 10 seconds without losing a life.
- `P` - pause the game.
- `Tab` / `Shift + Tab` - move between available controls.
- `Enter` / `Space` - activate the focused button, including Resume on the pause screen.

The B, O and P shortcuts use the English keyboard layout and work only during active play. They are ignored on the start, pause and Game Over screens, while typing in text fields, and while a dialog is open.

## Achievements

Open Achievements from the main menu to view badges, unlock conditions and progress.

- First Brew: successfully brew your first potion.
- Master Alchemist: successfully brew 50 potions across games.
- Perfect Run: finish a game with at least one successful brew and without losing any lives.
- Explorer: successfully brew 10 different recipes.
- Legendary Alchemist: successfully brew every recipe. Play on different difficulties to discover them all.

Failed brews and reactions that cost lives prevent Perfect Run for the current game. Pour Out and time penalties do not. Running out of time or ingredients can still unlock it.

New achievements appear in a notification for 6 seconds. Achievements unlocked together are shown in one message and are only awarded once.

Statistics and unlocked achievements are saved in localStorage in the current browser and remain after a reload. Continue Game restores the successful brews and mistakes of the saved game. Clearing browser site data removes this progress.

## Run locally

- `pnpm install` - install dependencies.
- `pnpm dev` - start the development server.
- `pnpm check` - run code checks.
- `pnpm build` - build the project.
