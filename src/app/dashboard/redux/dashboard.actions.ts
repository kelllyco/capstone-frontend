import { createAction, props } from "@ngrx/store";
import { ProjectPreview } from "../../shared/models/project.model";

export const loadProjectPreviews = createAction(
    "[Dashboard] Load Project Previews"
);

export const projectPreviewsLoaded = createAction(
    "[Dashboard] Project Previews Loaded",
    props<{ projectPreviews: ProjectPreview[] }>()
);