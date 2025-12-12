import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component,
  computed,
  provideZonelessChangeDetection,
  signal,
} from '@angular/core';
import {
  form,
  required,
  schema,
  min,
  max,
  maxLength,
  minLength,
  Field,
  applyEach,
  validate,
  applyWhen,
} from '@angular/forms/signals';
import { UpDownInput } from './up-down-input';
import { JsonPipe } from '@angular/common';
import { Item, ItemList, itemSchema } from './item-list';

const BASE_STAT_POINTS = 30;

export interface Character {
  readonly name: string;
  readonly class: string;
  readonly stats: {
    readonly strength: number;
    readonly dexterity: number;
    readonly constitution: number;
    readonly intelligence: number;
    readonly wisdom: number;
    readonly charisma: number;
  };

  readonly inventory: Item[];
}

@Component({
  selector: 'app-root',
  template: `
    <div>
      <h2>Character Sheet Editor</h2>
      <p>
        <label>Name: <input type="text" [field]="characterForm.name" /></label>
      </p>
      <p>
        <label
          >Class:
          <select [field]="characterForm.class">
            <option value="" disabled>-- select a class --</option>
            <option value="barbarian">Barbarian</option>
            <option value="fighter">Fighter</option>
            <option value="rogue">Rogue</option>
            <option value="wizard">Wizard</option>
          </select></label
        >
      </p>

      <h3>Stats</h3>
      <p>Points remaining: {{ statPointsRemaining() }}</p>
      <table>
        <tr>
          <td><label>Strength</label></td>
          <td><up-down-input [field]="characterForm.stats.strength" /></td>
        </tr>
        <tr>
          <td><label>Dexterity</label></td>
          <td><up-down-input [field]="characterForm.stats.dexterity" /></td>
        </tr>
        <tr>
          <td><label>Constitution</label></td>
          <td><up-down-input [field]="characterForm.stats.constitution" /></td>
        </tr>
        <tr>
          <td><label>Intelligence</label></td>
          <td><up-down-input [field]="characterForm.stats.intelligence" /></td>
        </tr>
        <tr>
          <td><label>Wisdom</label></td>
          <td><up-down-input [field]="characterForm.stats.wisdom" /></td>
        </tr>
        <tr>
          <td><label>Charisma</label></td>
          <td><up-down-input [field]="characterForm.stats.charisma" /></td>
        </tr>
      </table>

      <h3>Inventory</h3>
      <item-list [field]="characterForm.inventory" />
    </div>
    <div>
      <h2>Debug</h2>
      <h3>Errors</h3>
      <ul>
        @for (error of characterForm().errorSummary(); track error) {
        <li>{{ error.message ?? "Unknown error: " + error.kind }}</li>
        }
      </ul>
      <h3>Data</h3>
      <pre>{{ character() | json }}</pre>
    </div>
  `,
  imports: [Field, UpDownInput, JsonPipe, ItemList],
  styleUrl: './main.css',
})
export class CharacterSheet {
  readonly character = signal<Character>({
    name: '',
    class: '',
    stats: {
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      wisdom: 0,
      charisma: 0,
    },
    inventory: [],
  });

  readonly statSum = computed(() =>
    Object.values(this.character().stats).reduce((sum, stat) => sum + stat, 0)
  );
  readonly statPointsRemaining = computed(() =>
    Math.max(0, BASE_STAT_POINTS - this.statSum())
  );

  readonly characterForm = form(this.character, (characterPath) => {
    required(characterPath.name, {
      message: 'You must enter a character name',
    });
    minLength(characterPath.name, 3, {
      message: 'Character name must be at least 3 characters',
    });
    maxLength(characterPath.name, 20, {
      message: 'Character name must be less than 20 characters',
    });

    required(characterPath.class, {
      message: 'You must select a character class',
    });

    // Stat validation: each stat must be between 0 and BASE_STAT_POINTS,
    // and the sum of all stats must not exceed BASE_STAT_POINTS.
    applyEach(characterPath.stats, (stat) => {
      min(stat, 0);
      max(stat, (ctx) => {
        // Note: work around typing bug with `ctx.value()` currently.
        const current = ctx.valueOf(stat);

        // How many stat points are remaining to be distributed? (capped to 0+).
        return Math.min(BASE_STAT_POINTS, current + this.statPointsRemaining());
      });
    });

    validate(characterPath.stats, () => {
      if (this.statSum() > BASE_STAT_POINTS) {
        return {
          kind: 'stat_error',
          message: `Stat points cannot exceed ${BASE_STAT_POINTS}`,
        };
      }

      return;
    });

    applyEach(characterPath.inventory, itemSchema);
    validate(characterPath.inventory, ({ value }) => {
      const totalItems = value().reduce((sum, item) => sum + item.quantity, 0);
      if (totalItems > 10) {
        return {
          kind: 'inventory_error',
          message: 'You cannot have more than 10 items in your inventory',
        };
      }

      return;
    });

    // Apply the appropriate schema based on the character class.
    applyWhen(
      characterPath,
      ({ valueOf }) => valueOf(characterPath.class) === 'barbarian',
      barbarianSchema
    );
    applyWhen(
      characterPath,
      ({ valueOf }) => valueOf(characterPath.class) === 'fighter',
      fighterSchema
    );
    applyWhen(
      characterPath,
      ({ valueOf }) => valueOf(characterPath.class) === 'rogue',
      rogueSchema
    );
    applyWhen(
      characterPath,
      ({ valueOf }) => valueOf(characterPath.class) === 'wizard',
      wizardSchema
    );
  });
}

bootstrapApplication(CharacterSheet, {
  providers: [provideZonelessChangeDetection()],
}).catch((err) => console.error(err));

const wizardSchema = schema<Character>((characterPath) => {
  validate(characterPath.stats.intelligence, ({ value }) =>
    value() < 12
      ? {
          kind: 'wizard_intelligence',
          message: 'Wizards must have an intelligence score of 12 or higher',
        }
      : undefined
  );
});

const barbarianSchema = schema<Character>((characterPath) => {
  validate(characterPath.stats.strength, ({ value }) =>
    value() < 10
      ? {
          kind: 'barbarian_strength',
          message: 'Barbarians must have a strength score of 10 or higher',
        }
      : undefined
  );
});

const fighterSchema = schema<Character>((characterPath) => {
  validate(characterPath.stats.strength, ({ value }) =>
    value() < 8
      ? {
          kind: 'fighter_strength',
          message: 'Fighters must have a strength score of 8 or higher',
        }
      : undefined
  );
});

const rogueSchema = schema<Character>((characterPath) => {
  validate(characterPath.stats.dexterity, ({ value }) =>
    value() < 13
      ? {
          kind: 'rogue_dexterity',
          message: 'Rogues must have a dexterity score of 13 or higher',
        }
      : undefined
  );
});
