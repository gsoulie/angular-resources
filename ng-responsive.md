# Service responsive générique  

````typescript
@Injectable({
  providedIn: "root",
})
export class ResponsiveManager {
  // Add other widths as needed
  private readonly small = "(max-width: 600px)";

  // Observe widths and convert to a signal
  private readonly screenWidth = toSignal(
    inject(BreakpointObserver).observe([this.small]),
  );

  // Create computeds for easy component binding
  public readonly smallWidth = computed(
    () => this.screenWidth()?.breakpoints[this.small],
  );

  // Example: More derived signals for components
  private readonly sideNavOpened = signal(true); // Manages open state
  public readonly sideNavMode = computed(() =>
    !this.smallWidth() ? "side" : "over",
  ); // Changes mode based on width

  toggleSideNav() {
    this.sideNavOpened.set(!this.sideNavOpened());
  }
}
````
