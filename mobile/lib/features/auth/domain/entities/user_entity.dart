class UserEntity {
  final String id;
  final String email;
  final String fullName;
  final String? phone;
  final bool isActive;
  final String tenantId;
  final List<String> roles;

  const UserEntity({
    required this.id,
    required this.email,
    required this.fullName,
    this.phone,
    required this.isActive,
    required this.tenantId,
    this.roles = const [],
  });

  factory UserEntity.fromJson(Map<String, dynamic> json) {
    return UserEntity(
      id: json['id'] as String,
      email: json['email'] as String,
      fullName: json['fullName'] as String,
      phone: json['phone'] as String?,
      isActive: json['isActive'] as bool,
      tenantId: json['tenantId'] as String,
      roles: (json['roles'] as List<dynamic>?)
              ?.map((role) => role as String)
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'fullName': fullName,
      'phone': phone,
      'isActive': isActive,
      'tenantId': tenantId,
      'roles': roles,
    };
  }
}
