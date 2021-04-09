import {
  ADD_GROUP,
  ADD_GROUP_MEMBER,
  UPDATE_GROUP,
  UPDATE_GROUP_MEMBER,
  UPDATE_GROUP_MEMBER_MODULES,
  DELETE_GROUP,
  DELETE_GROUP_MEMBER,
} from "./groupModules-actions";

const groupModulesReducer = (state, action) => {
  switch (action.type) {
    case ADD_GROUP:
      return {};
    case ADD_GROUP_MEMBER:
      return {};
    case UPDATE_GROUP:
      return {};
    case UPDATE_GROUP_MEMBER:
      return {};
    case UPDATE_GROUP_MEMBER_MODULES:
      return {};
    case DELETE_GROUP:
      return {};
    case DELETE_GROUP_MEMBER:
      return {};
    default:
      return state;
  }
};

export default groupModulesReducer;
