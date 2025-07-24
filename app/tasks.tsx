import { useUser } from "@clerk/clerk-expo";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { mockTasks } from "@/data/tasks";
import { getCompletedTasks, getPendingTasks, getPriorityColor, getTaskStats } from "@/utils/tasks";
import { getAvatarInitial } from "@/utils/search";

const TasksScreen = () => {
  const { user } = useUser();
  const router = useRouter();

  const completedTasks = getCompletedTasks(mockTasks);
  const pendingTasks = getPendingTasks(mockTasks);
  const taskStats = getTaskStats(mockTasks);

  return (
    <View className="flex-1">
      {/* Header Section */}
      <View className="bg-white shadow-sm pt-safe py-6 px-4 z-10">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => router.back()}
            className=" items-center justify-center mr-4"
          >
            <Feather name="chevron-left" size={24} color="#374151" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900 mb-1">Tasks</Text>
            <Text className="text-base text-gray-600">
              Manage your daily tasks
            </Text>
          </View>
          <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center">
            <Text className="text-white font-semibold text-lg">
              {getAvatarInitial(user?.emailAddresses[0].emailAddress)}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Stats Section */}
        <View className="px-4 py-6">
          <View className="flex-row justify-between">
            <View className="bg-white rounded-2xl shadow-sm p-4 flex-1 mx-1">
              <View className="w-10 h-10 bg-green-500 rounded-full items-center justify-center mb-3">
                <Feather name="check-circle" size={18} color="white" />
              </View>
              <Text className="text-2xl font-bold text-gray-900 mb-1">
                {taskStats.completed}
              </Text>
              <Text className="text-sm text-gray-600">Completed</Text>
            </View>

            <View className="bg-white rounded-2xl shadow-sm p-4 flex-1 mx-1">
              <View className="w-10 h-10 bg-orange-500 rounded-full items-center justify-center mb-3">
                <Feather name="clock" size={18} color="white" />
              </View>
              <Text className="text-2xl font-bold text-gray-900 mb-1">
                {taskStats.pending}
              </Text>
              <Text className="text-sm text-gray-600">Pending</Text>
            </View>

            <View className="bg-white rounded-2xl shadow-sm p-4 flex-1 mx-1">
              <View className="w-10 h-10 bg-blue-500 rounded-full items-center justify-center mb-3">
                <Feather name="list" size={18} color="white" />
              </View>
              <Text className="text-2xl font-bold text-gray-900 mb-1">
                {taskStats.total}
              </Text>
              <Text className="text-sm text-gray-600">Total</Text>
            </View>
          </View>
        </View>

        {/* Pending Tasks */}
        <View className="px-4 pb-6">
          <Text className="text-xl font-semibold text-gray-900 mb-4">
            Pending Tasks
          </Text>
          {pendingTasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              className="bg-white rounded-2xl shadow-sm p-4 mb-3"
            >
              <View className="flex-row items-center">
                <View className="w-6 h-6 border-2 border-gray-300 rounded-full mr-4" />
                <View className="flex-1">
                  <Text className="text-base font-medium text-gray-900 mb-1">
                    {task.title}
                  </Text>
                  <View className="flex-row items-center">
                    <View
                      className={`w-2 h-2 ${getPriorityColor(task.priority)} rounded-full mr-2`}
                    />
                    <Text className="text-sm text-gray-500 mr-3">
                      {task.priority} priority
                    </Text>
                    <Text className="text-sm text-gray-400">{task.date}</Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={16} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Completed Tasks */}
        <View className="px-4 pb-8">
          <Text className="text-xl font-semibold text-gray-900 mb-4">
            Completed Tasks
          </Text>
          {completedTasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              className="bg-white rounded-2xl shadow-sm p-4 mb-3"
            >
              <View className="flex-row items-center">
                <View className="w-6 h-6 bg-green-500 rounded-full mr-4 items-center justify-center">
                  <Feather name="check" size={14} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-gray-500 mb-1 line-through">
                    {task.title}
                  </Text>
                  <View className="flex-row items-center">
                    <View
                      className={`w-2 h-2 ${getPriorityColor(task.priority)} rounded-full mr-2`}
                    />
                    <Text className="text-sm text-gray-400 mr-3">
                      {task.priority} priority
                    </Text>
                    <Text className="text-sm text-gray-400">{task.date}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default TasksScreen;
