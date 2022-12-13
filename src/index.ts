import { mainWorld } from "white-dwarf";
import { coreRenderContext } from "white-dwarf/src/Core/Context/RenderContext";
import { CoreStartProps } from "white-dwarf/src/Core/Context/SystemContext";
import { systemContext } from "white-dwarf/src/Core/CoreSetup";
import { TransformData3D } from "white-dwarf/src/Core/Locomotion/DataComponent/TransformData3D";
import { IcosphereMeshGeneratorData } from "white-dwarf/src/Core/Render/DataComponent/MeshGenerator/IcosphereMeshGeneratorData";
import { MeshRenderData3D } from "white-dwarf/src/Core/Render/DataComponent/MeshRenderData3D";
import { PerspectiveCameraData3D } from "white-dwarf/src/Core/Render/DataComponent/PerspectiveCameraData3D";
import { MaterialDescriptor } from "white-dwarf/src/Core/Render/Material";
import { MainCameraInitSystem } from "white-dwarf/src/Core/Render/System/MainCameraInitSystem";
import { MainCameraTag } from "white-dwarf/src/Core/Render/TagComponent/MainCameraTag";
import { WebGLRenderPipelineRegister } from "white-dwarf/src/Core/Render/WebGLRenderPipelineRegister";
import {
  WorldSerializer,
  IWorldObject,
} from "white-dwarf/src/Core/Serialization/WorldSerializer";
import { EditorSystemWebGLRegister } from "white-dwarf/src/Editor/EditorSystemWebGLRegister";
import { EditorCamTagAppendSystem } from "white-dwarf/src/Editor/System/EditorCamTagAppendSystem";
import { Vector3 } from "white-dwarf/src/Mathematics/Vector3";

export const main = () => {
  systemContext.coreSetup = () => {
    if (coreRenderContext.mainCanvas) {
      new WebGLRenderPipelineRegister(coreRenderContext.mainCanvas).register(
        mainWorld
      );
    }
  };

  systemContext.coreStart = async (props: CoreStartProps) => {
    // If in editor mode, deserialize the world.
    if (props.worldObject) {
      WorldSerializer.deserializeWorld(mainWorld, props.worldObject);
    } else {
      // Read world.json.
      const worldObject = (await fetch("world.json").then((response) =>
        response.json()
      )) as IWorldObject;
      // Deserialize the world.
      WorldSerializer.deserializeWorld(mainWorld, worldObject);
    }

    // Add a camera init system.
    mainWorld.registerSystem(MainCameraInitSystem);
  };

  systemContext.editorStart = () => {
    // Add a editor cam.
    mainWorld
      .createEntity("Editor Main Camera")
      .addComponent(TransformData3D, {
        position: new Vector3(0, 0, -10),
      })
      .addComponent(PerspectiveCameraData3D, {
        fov: Math.PI / 2,
      })
      .addComponent(MainCameraTag);

    // Register Editor System.
    if (coreRenderContext.mainCanvas) {
      new EditorSystemWebGLRegister(coreRenderContext.mainCanvas).register(
        mainWorld
      );
    }

    // // Add a earth.
    // mainWorld
    //   .createEntity("Earth")
    //   .addComponent(TransformData3D, {
    //     position: new Vector3(0, 0, 0),
    //   })
    //   .addComponent(IcosphereMeshGeneratorData, {
    //     radius: 1,
    //     subdivisions: 3,
    //     flatNormal: false,
    //   })
    //   .addComponent(MeshRenderData3D, {
    //     materialDesc: new MaterialDescriptor({
    //       tex1: "assets/1_earth_8k.jpg",
    //     }),
    //   });

    // Setup editor scene camera.
    try {
      mainWorld.registerSystem(EditorCamTagAppendSystem);
    } catch (error) {
      console.error(error);
    }
  };
};
