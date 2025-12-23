/**
 * Formulaire avec champs text dépendant de la valeur sélectionnée dans le champ liste déroulante
 **/

@Component({
  template: `
    <form>
      <div>
        <label>Reason: </label>
        <select [field]="form.reason">
          <option value="scheduling">Scheduling conflict</option>
          <option value="price">Price</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label>Explanation: </label>
        <textarea [field]="form.explanation" placeholder="Please explain..."></textarea>
        @if (form.explanation().touched() && form.explanation().invalid()) {
          <span style="color: red;">* Required when 'Other' is selected</span>
        }
      </div>
      <button type="submit" [disabled]="form().invalid()">Submit</button>
    </form>
  `,
})
export class CancellationComponent {
  cancellation = signal({
    reason: '',
    explanation: ''
  });

  form = form(this.cancellation, ctx => {
    required(ctx.reason);
    required(ctx.explanation, {
      when: () => this.cancellation().reason === 'other'
    });
  });
}
