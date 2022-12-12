import { mainWorld } from "white-dwarf";
import { coreRenderContext } from "white-dwarf/src/Core/Context/RenderContext";
import { CoreStartProps } from "white-dwarf/src/Core/Context/SystemContext";
import { systemContext } from "white-dwarf/src/Core/CoreSetup";
import { TransformData3D } from "white-dwarf/src/Core/Locomotion/DataComponent/TransformData3D";
import { PerspectiveCameraData3D } from "white-dwarf/src/Core/Render/DataComponent/PerspectiveCameraData3D";
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

    // Setup editor scene camera.
    try {
      mainWorld.registerSystem(EditorCamTagAppendSystem);
    } catch (error) {
      console.error(error);
    }
  };
};
