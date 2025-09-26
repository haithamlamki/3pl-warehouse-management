import 'dart:typed_data';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/entities/route_entity.dart';
import '../../domain/usecases/get_routes_usecase.dart';
import '../../domain/usecases/start_route_usecase.dart';
import '../../domain/usecases/complete_stop_usecase.dart';
import '../../domain/usecases/submit_epod_usecase.dart';

final routesProvider = FutureProvider<List<RouteEntity>>((ref) async {
  final getRoutesUseCase = ref.read(getRoutesUseCaseProvider);
  final result = await getRoutesUseCase();
  
  return result.fold(
    (failure) => throw failure,
    (routes) => routes,
  );
});

final deliveryProvider = StateNotifierProvider<DeliveryNotifier, AsyncValue<void>>((ref) {
  return DeliveryNotifier(
    ref.read(startRouteUseCaseProvider),
    ref.read(completeStopUseCaseProvider),
    ref.read(submitEPodUseCaseProvider),
  );
});

class DeliveryNotifier extends StateNotifier<AsyncValue<void>> {
  final StartRouteUseCase _startRouteUseCase;
  final CompleteStopUseCase _completeStopUseCase;
  final SubmitEPodUseCase _submitEPodUseCase;

  DeliveryNotifier(
    this._startRouteUseCase,
    this._completeStopUseCase,
    this._submitEPodUseCase,
  ) : super(const AsyncValue.data(null));

  Future<void> startRoute(String routeId) async {
    state = const AsyncValue.loading();
    
    try {
      final result = await _startRouteUseCase(StartRouteParams(routeId: routeId));
      
      result.fold(
        (failure) => state = AsyncValue.error(failure, StackTrace.current),
        (_) => state = const AsyncValue.data(null),
      );
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
    }
  }

  Future<void> completeStop(String stopId) async {
    state = const AsyncValue.loading();
    
    try {
      final result = await _completeStopUseCase(CompleteStopParams(stopId: stopId));
      
      result.fold(
        (failure) => state = AsyncValue.error(failure, StackTrace.current),
        (_) => state = const AsyncValue.data(null),
      );
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
    }
  }

  Future<void> submitEPod({
    required String signerName,
    String? signerId,
    required List<dynamic> photos,
    required Uint8List? signatureBytes,
    required String notes,
  }) async {
    state = const AsyncValue.loading();
    
    try {
      final result = await _submitEPodUseCase(SubmitEPodParams(
        signerName: signerName,
        signerId: signerId,
        photos: photos,
        signatureBytes: signatureBytes,
        notes: notes,
      ));
      
      result.fold(
        (failure) => state = AsyncValue.error(failure, StackTrace.current),
        (_) => state = const AsyncValue.data(null),
      );
    } catch (e) {
      state = AsyncValue.error(e, StackTrace.current);
    }
  }
}
