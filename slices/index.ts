import dynamic from "next/dynamic";
import NewsShowcase from "./NewsShowcase";

export const components = {
	Hero: dynamic(() => import("./Hero")),
	StoryStats: dynamic(() => import("./StoryStats")),
	SportsGrid: dynamic(() => import("./SportsGrid")),
	TrainingLocations: dynamic(() => import("./TrainingLocations")),
	NewsShowcase,
	JoinBand: dynamic(() => import("./JoinBand")),
	TextBlock: dynamic(() => import("./TextBlock")),
	ImageHighlight: dynamic(() => import("./ImageHighlight")),
	CallToAction: dynamic(() => import("./CallToAction")),
};
