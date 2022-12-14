import { Component, ComponentSchema, Types } from "white-dwarf/ecsy";
import { IComponent } from "white-dwarf/src/Core/ComponentRegistry";

@IComponent.register
export class SunLightSpinData extends Component<SunLightSpinData> {
  static schema: ComponentSchema = {
    speed: {
      type: Types.Number,
      default: 0.01,
    },
  };

  speed: number = 0.01;
}
