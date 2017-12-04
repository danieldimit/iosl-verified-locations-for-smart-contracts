import { combineReducers } from 'redux';
import BreadcrumbReducer from "./reducer_breadcrumb";
import ProjectsReducer from "./reducer_projects";
import TweetStatsReducer from './reducer_tweet_stats';
import CalcedGraphsReducer from './reducer_calced_graphs';
import RelevantProjectsReducer from './reducer_relevant_projects';
import HeroesReducer from './reducer_heroes';


const rootReducer = combineReducers({
    breadcrumb: BreadcrumbReducer,
    projects: ProjectsReducer,
    tweetStats: TweetStatsReducer,
    calcedGraphs: CalcedGraphsReducer,
    relevantProjects: RelevantProjectsReducer,
    heroes: HeroesReducer
});


export default rootReducer;
