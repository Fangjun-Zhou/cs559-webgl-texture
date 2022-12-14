import { quat } from "gl-matrix";
import { System, SystemQueries } from "white-dwarf/ecsy";
import { TransformData3D } from "white-dwarf/src/Core/Locomotion/DataComponent/TransformData3D";
import { SunLightSpinData } from "../DataComponent/SunLightSpinData";

export class SunLightSpinSystem extends System {
  static queries: SystemQueries = {
    sunLightEntities: {
      components: [TransformData3D, SunLightSpinData],
    },
  };

  execute(delta: number, time: number): void {
    this.queries.sunLightEntities.results.forEach((entity) => {
      const transformData = entity.getMutableComponent(
        TransformData3D
      ) as TransformData3D;
      const sunLightSpinData = entity.getComponent(
        SunLightSpinData
      ) as SunLightSpinData;

      const spinQuat = quat.rotateY(
        quat.create(),
        quat.create(),
        sunLightSpinData.speed * delta
      );
      quat.multiply(
        transformData.rotation.value,
        transformData.rotation.value,
        spinQuat
      );
    });
  }
}
