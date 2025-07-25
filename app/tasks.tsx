import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/contexts/auth-context";
import { mockTasks } from "~/data/tasks";
import { getAvatarInitial } from "~/utils/search";
import {
  getCompletedTasks,
  getPendingTasks,
  getPriorityColor,
  getTaskStats,
} from "~/utils/tasks";

const TasksScreen = () => {
  const { user } = useAuth();
  const router = useRouter();

  const completedTasks = getCompletedTasks(mockTasks);
  const pendingTasks = getPendingTasks(mockTasks);
  const taskStats = getTaskStats(mockTasks);

  return (
    <View className="flex-1">
      {/* Header Section */}
      <View className="bg-background shadow-sm pt-safe py-6 px-4 z-10">
        <View className="flex-row items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onPress={() => router.back()}
            className="mr-4"
          >
            <Feather name="chevron-left" size={24} color="#374151" />
          </Button>
          <View className="flex-1">
            <Text className="text-2xl font-bold mb-1">Tasks</Text>
            <Text className="text-base text-muted-foreground">
              Manage your daily tasks
            </Text>
          </View>
          <View className="w-12 h-12 bg-primary rounded-full items-center justify-center">
            <Text className="text-primary-foreground font-semibold text-lg">
              {getAvatarInitial(user?.email)}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Stats Section */}
        <View className="px-4 py-6">
          <View className="flex-row justify-between">
            <Card className="flex-1 mx-1">
              <CardContent className="p-4">
                <View className="w-10 h-10 bg-green-500 rounded-full items-center justify-center mb-3">
                  <Feather name="check-circle" size={18} color="white" />
                </View>
                <Text className="text-2xl font-bold mb-1">
                  {taskStats.completed}
                </Text>
                <Text className="text-sm text-muted-foreground">Completed</Text>
              </CardContent>
            </Card>

            <Card className="flex-1 mx-1">
              <CardContent className="p-4">
                <View className="w-10 h-10 bg-orange-500 rounded-full items-center justify-center mb-3">
                  <Feather name="clock" size={18} color="white" />
                </View>
                <Text className="text-2xl font-bold mb-1">
                  {taskStats.pending}
                </Text>
                <Text className="text-sm text-muted-foreground">Pending</Text>
              </CardContent>
            </Card>

            <Card className="flex-1 mx-1">
              <CardContent className="p-4">
                <View className="w-10 h-10 bg-primary rounded-full items-center justify-center mb-3">
                  <Feather name="list" size={18} color="white" />
                </View>
                <Text className="text-2xl font-bold mb-1">
                  {taskStats.total}
                </Text>
                <Text className="text-sm text-muted-foreground">Total</Text>
              </CardContent>
            </Card>
          </View>
        </View>

        {/* Pending Tasks */}
        <View className="px-4 pb-6">
          <Text className="text-xl font-semibold mb-4">
            Pending Tasks
          </Text>
          {pendingTasks.map((task) => (
            <Card key={task.id} className="mb-3">
              <CardContent className="p-4">
                <TouchableOpacity>
                  <View className="flex-row items-center">
                    <View className="w-6 h-6 border-2 border-muted rounded-full mr-4" />
                    <View className="flex-1">
                      <Text className="text-base font-medium mb-1">
                        {task.title}
                      </Text>
                      <View className="flex-row items-center">
                        <View
                          className={`w-2 h-2 ${getPriorityColor(task.priority)} rounded-full mr-2`}
                        />
                        <Text className="text-sm text-muted-foreground mr-3">
                          {task.priority} priority
                        </Text>
                        <Text className="text-sm text-muted-foreground">{task.date}</Text>
                      </View>
                    </View>
                    <Feather name="chevron-right" size={16} color="#9CA3AF" />
                  </View>
                </TouchableOpacity>
              </CardContent>
            </Card>
          ))}
        </View>

        {/* Completed Tasks */}
        <View className="px-4 pb-8">
          <Text className="text-xl font-semibold mb-4">
            Completed Tasks
          </Text>
          {completedTasks.map((task) => (
            <Card key={task.id} className="mb-3">
              <CardContent className="p-4">
                <TouchableOpacity>
                  <View className="flex-row items-center">
                    <View className="w-6 h-6 bg-green-500 rounded-full mr-4 items-center justify-center">
                      <Feather name="check" size={14} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-medium text-muted-foreground mb-1 line-through">
                        {task.title}
                      </Text>
                      <View className="flex-row items-center">
                        <View
                          className={`w-2 h-2 ${getPriorityColor(task.priority)} rounded-full mr-2`}
                        />
                        <Text className="text-sm text-muted-foreground mr-3">
                          {task.priority} priority
                        </Text>
                        <Text className="text-sm text-muted-foreground">{task.date}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </CardContent>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default TasksScreen;
