class RouteEntity {
  final String id;
  final String routeNumber;
  final String status;
  final DateTime? plannedStartTime;
  final DateTime? actualStartTime;
  final DateTime? actualEndTime;
  final double? totalDistance;
  final double? totalDuration;
  final List<RouteStopEntity> stops;

  const RouteEntity({
    required this.id,
    this.routeNumber = '',
    required this.status,
    this.plannedStartTime,
    this.actualStartTime,
    this.actualEndTime,
    this.totalDistance,
    this.totalDuration,
    this.stops = const [],
  });

  factory RouteEntity.fromJson(Map<String, dynamic> json) {
    return RouteEntity(
      id: json['id'] as String,
      routeNumber: json['routeNumber'] as String? ?? '',
      status: json['status'] as String,
      plannedStartTime: json['plannedStartTime'] != null
          ? DateTime.parse(json['plannedStartTime'] as String)
          : null,
      actualStartTime: json['actualStartTime'] != null
          ? DateTime.parse(json['actualStartTime'] as String)
          : null,
      actualEndTime: json['actualEndTime'] != null
          ? DateTime.parse(json['actualEndTime'] as String)
          : null,
      totalDistance: json['totalDistance'] as double?,
      totalDuration: json['totalDuration'] as double?,
      stops: (json['stops'] as List<dynamic>?)
              ?.map((stop) => RouteStopEntity.fromJson(stop as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'routeNumber': routeNumber,
      'status': status,
      'plannedStartTime': plannedStartTime?.toIso8601String(),
      'actualStartTime': actualStartTime?.toIso8601String(),
      'actualEndTime': actualEndTime?.toIso8601String(),
      'totalDistance': totalDistance,
      'totalDuration': totalDuration,
      'stops': stops.map((stop) => stop.toJson()).toList(),
    };
  }
}

class RouteStopEntity {
  final String id;
  final String orderId;
  final int sequence;
  final String status;
  final DateTime? eta;
  final DateTime? actualArrival;
  final String? address;
  final double? latitude;
  final double? longitude;
  final OrderEntity? order;

  const RouteStopEntity({
    required this.id,
    required this.orderId,
    required this.sequence,
    required this.status,
    this.eta,
    this.actualArrival,
    this.address,
    this.latitude,
    this.longitude,
    this.order,
  });

  factory RouteStopEntity.fromJson(Map<String, dynamic> json) {
    return RouteStopEntity(
      id: json['id'] as String,
      orderId: json['orderId'] as String,
      sequence: json['seq'] as int,
      status: json['status'] as String,
      eta: json['eta'] != null
          ? DateTime.parse(json['eta'] as String)
          : null,
      actualArrival: json['actualArrival'] != null
          ? DateTime.parse(json['actualArrival'] as String)
          : null,
      address: json['address'] as String?,
      latitude: json['latitude'] as double?,
      longitude: json['longitude'] as double?,
      order: json['order'] != null
          ? OrderEntity.fromJson(json['order'] as Map<String, dynamic>)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'orderId': orderId,
      'seq': sequence,
      'status': status,
      'eta': eta?.toIso8601String(),
      'actualArrival': actualArrival?.toIso8601String(),
      'address': address,
      'latitude': latitude,
      'longitude': longitude,
      'order': order?.toJson(),
    };
  }
}

class OrderEntity {
  final String id;
  final String type;
  final String status;
  final String? notes;
  final List<OrderLineEntity> lines;

  const OrderEntity({
    required this.id,
    required this.type,
    required this.status,
    this.notes,
    this.lines = const [],
  });

  factory OrderEntity.fromJson(Map<String, dynamic> json) {
    return OrderEntity(
      id: json['id'] as String,
      type: json['type'] as String,
      status: json['status'] as String,
      notes: json['notes'] as String?,
      lines: (json['lines'] as List<dynamic>?)
              ?.map((line) => OrderLineEntity.fromJson(line as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'type': type,
      'status': status,
      'notes': notes,
      'lines': lines.map((line) => line.toJson()).toList(),
    };
  }
}

class OrderLineEntity {
  final String id;
  final String itemSku;
  final double qty;
  final String? lotId;

  const OrderLineEntity({
    required this.id,
    required this.itemSku,
    required this.qty,
    this.lotId,
  });

  factory OrderLineEntity.fromJson(Map<String, dynamic> json) {
    return OrderLineEntity(
      id: json['id'] as String,
      itemSku: json['itemSku'] as String,
      qty: (json['qty'] as num).toDouble(),
      lotId: json['lotId'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'itemSku': itemSku,
      'qty': qty,
      'lotId': lotId,
    };
  }
}
