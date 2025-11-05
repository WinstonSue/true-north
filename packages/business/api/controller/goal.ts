import { request } from '@life-toolkit/share-request';
import { Goal as GoalVO, ResponsePageVo, ResponseListVo, ResponseTreeVo } from '@life-toolkit/vo';

export default class GoalController {
  static async create(body: GoalVO.CreateGoalVo) {
    return request<GoalVO.GoalVo>({ method: "post" })(`/goal/create`, body);
  }

  static async delete(id: string) {
    return request<void>({ method: "remove" })(`/goal/delete/${id}`);
  }

  static async update(id: string, body: GoalVO.UpdateGoalVo) {
    return request<GoalVO.GoalVo>({ method: "put" })(`/goal/update/${id}`, body);
  }

  static async find(id: string) {
    return request<GoalVO.GoalVo>({ method: "get" })(`/goal/find/${id}`);
  }

  static async findWithRelations(id: string) {
    return request<GoalVO.GoalVo>({ method: "get" })(`/goal/find-with-relations/${id}`);
  }
  static async page(params: GoalVO.GoalPageFilterVo) {
    return request<ResponsePageVo<GoalVO.GoalWithoutRelationsVo>>({ method: "get" })(`/goal/page`, params);
  }
  static async findRoots() {
    return request<GoalVO.GoalVo[]>({ method: "get" })(`/goal/find-roots`);
  }

  static async abandon(id: string) {
    return request<boolean>({ method: "put" })(`/goal/abandon/${id}`);
  }

  static async restore(id: string) {
    return request<boolean>({ method: "put" })(`/goal/restore/${id}`);
  }
  static async findByFilter(params: GoalVO.GoalFilterVo) {
    return request<ResponseListVo<GoalVO.GoalWithoutRelationsVo>>({ method: "get" })(`/goal/find-by-filter`, params);
  }

  static async getTree(params: GoalVO.GoalFilterVo) {
    return request<ResponseTreeVo<GoalVO.GoalVo>>({ method: "get" })(`/goal/get-tree`, params);
  }
}
