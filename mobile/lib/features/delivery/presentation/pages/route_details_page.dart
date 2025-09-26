import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../providers/delivery_provider.dart';
import '../../domain/entities/route_entity.dart';

class RouteDetailsPage extends ConsumerWidget {
  final String routeId;

  const RouteDetailsPage({
    super.key,
    required this.routeId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final routesState = ref.watch(routesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Route Details'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              ref.refresh(routesProvider);
            },
          ),
        ],
      ),
      body: routesState.when(
        data: (routes) {
          final route = routes.firstWhere(
            (r) => r.id == routeId,
            orElse: () => throw Exception('Route not found'),
          );
          return _buildRouteDetails(context, route);
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stackTrace) => Center(
          child: Text('Error: $error'),
        ),
      ),
    );
  }

  Widget _buildRouteDetails(BuildContext context, RouteEntity route) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Route Header Card
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: _getStatusColor(route.status),
                          borderRadius: BorderRadius.circular(16),
                        ),
                        child: Text(
                          route.status.toUpperCase(),
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const Spacer(),
                      Text(
                        route.routeNumber ?? 'N/A',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  
                  if (route.plannedStartTime != null) ...[
                    _buildInfoRow(
                      context,
                      Icons.schedule,
                      'Planned Start',
                      _formatDateTime(route.plannedStartTime!),
                    ),
                  ],
                  
                  if (route.actualStartTime != null) ...[
                    _buildInfoRow(
                      context,
                      Icons.play_arrow,
                      'Actual Start',
                      _formatDateTime(route.actualStartTime!),
                    ),
                  ],
                  
                  if (route.totalDistance != null) ...[
                    _buildInfoRow(
                      context,
                      Icons.straighten,
                      'Total Distance',
                      '${route.totalDistance!.toStringAsFixed(1)} km',
                    ),
                  ],
                  
                  if (route.totalDuration != null) ...[
                    _buildInfoRow(
                      context,
                      Icons.timer,
                      'Total Duration',
                      '${route.totalDuration!.toStringAsFixed(0)} min',
                    ),
                  ],
                ],
              ),
            ),
          ),
          
          const SizedBox(height: 16),
          
          // Stops List
          Text(
            'Delivery Stops (${route.stops.length})',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          
          ...route.stops.map((stop) => _buildStopCard(context, stop)),
          
          const SizedBox(height: 16),
          
          // Action Buttons
          if (route.status.toLowerCase() == 'planned') ...[
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () {
                  _startRoute(context, ref);
                },
                icon: const Icon(Icons.play_arrow),
                label: const Text('Start Route'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildInfoRow(BuildContext context, IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Icon(icon, size: 16, color: Colors.grey[600]),
          const SizedBox(width: 8),
          Text(
            label,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: Colors.grey[600],
            ),
          ),
          const Spacer(),
          Text(
            value,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStopCard(BuildContext context, RouteStopEntity stop) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: InkWell(
        onTap: () {
          context.go('/home/route/$routeId/stop/${stop.id}');
        },
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: _getStopStatusColor(stop.status),
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Text(
                    stop.sequence.toString(),
                    style: const TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      stop.address ?? 'Address not available',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        fontWeight: FontWeight.w500,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      stop.status.toUpperCase(),
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                        color: _getStopStatusColor(stop.status),
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    if (stop.eta != null) ...[
                      const SizedBox(height: 4),
                      Text(
                        'ETA: ${_formatTime(stop.eta!)}',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: Colors.grey[600],
                        ),
                      ),
                    ],
                  ],
                ),
              ),
              const Icon(Icons.arrow_forward_ios, size: 16),
            ],
          ),
        ),
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'planned':
        return Colors.blue;
      case 'in_progress':
        return Colors.orange;
      case 'completed':
        return Colors.green;
      case 'cancelled':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  Color _getStopStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return Colors.grey;
      case 'in_progress':
        return Colors.orange;
      case 'completed':
        return Colors.green;
      case 'failed':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  String _formatDateTime(DateTime dateTime) {
    return '${dateTime.day}/${dateTime.month}/${dateTime.year} ${dateTime.hour.toString().padLeft(2, '0')}:${dateTime.minute.toString().padLeft(2, '0')}';
  }

  String _formatTime(DateTime dateTime) {
    return '${dateTime.hour.toString().padLeft(2, '0')}:${dateTime.minute.toString().padLeft(2, '0')}';
  }

  void _startRoute(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Start Route'),
        content: const Text('Are you ready to start this delivery route?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
              ref.read(deliveryProvider.notifier).startRoute(routeId);
            },
            child: const Text('Start'),
          ),
        ],
      ),
    );
  }
}
