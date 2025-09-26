import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/entities/user_entity.dart';
import '../../domain/usecases/login_usecase.dart';
import '../../domain/usecases/logout_usecase.dart';
import '../../domain/usecases/refresh_token_usecase.dart';

final authProvider = StateNotifierProvider<AuthNotifier, AsyncValue<UserEntity?>>((ref) {
  return AuthNotifier(
    ref.read(loginUseCaseProvider),
    ref.read(logoutUseCaseProvider),
    ref.read(refreshTokenUseCaseProvider),
  );
});

class AuthNotifier extends StateNotifier<AsyncValue<UserEntity?>> {
  final LoginUseCase _loginUseCase;
  final LogoutUseCase _logoutUseCase;
  final RefreshTokenUseCase _refreshTokenUseCase;

  AuthNotifier(
    this._loginUseCase,
    this._logoutUseCase,
    this._refreshTokenUseCase,
  ) : super(const AsyncValue.loading()) {
    _checkAuthStatus();
  }

  Future<void> _checkAuthStatus() async {
    try {
      // Check if user is already logged in
      // This would typically check local storage for tokens
      state = const AsyncValue.data(null);
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
    }
  }

  Future<void> login(String email, String password) async {
    state = const AsyncValue.loading();
    
    try {
      final result = await _loginUseCase(LoginParams(email: email, password: password));
      
      result.fold(
        (failure) => state = AsyncValue.error(failure, StackTrace.current),
        (user) => state = AsyncValue.data(user),
      );
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
    }
  }

  Future<void> logout() async {
    try {
      await _logoutUseCase();
      state = const AsyncValue.data(null);
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
    }
  }

  Future<void> refreshToken() async {
    try {
      final result = await _refreshTokenUseCase();
      
      result.fold(
        (failure) => state = AsyncValue.error(failure, StackTrace.current),
        (user) => state = AsyncValue.data(user),
      );
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
    }
  }
}
