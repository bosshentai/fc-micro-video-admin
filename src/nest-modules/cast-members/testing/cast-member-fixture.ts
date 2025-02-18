const _keyInResponse = ['id', 'name', 'type', 'created_at'];

export class GetCastMemberFixture {
  static keyInResponse = _keyInResponse;
}

export class CreateCastMemberFixture {
  static keyInResponse = _keyInResponse;

  static arrangeForCreate() {}
}
