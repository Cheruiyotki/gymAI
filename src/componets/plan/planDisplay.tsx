import { Dumbbell } from "lucide-react";
import type { DaySchedule } from "../../types";
import { Card } from "../ui/Card";

function DayCard({ schedule }: { schedule: DaySchedule }) {
    return <Card variant="bordered" className="overflow-hidden">
        <div>
            <div>
                <h3>{schedule.day}</h3>
                <p>{schedule.focus}</p>
            </div>
            <div>
                <Dumbbell/>
                <span>{schedule.exercises.length} exercises</span>
            </div>
        </div>

        <div>
            <table>
                <thead>
                    <tr>
                        <th>Exercise</th>
                        <th>Sets</th>
                        <th>Rest</th>
                        <th>Reps</th>
                    </tr>
                </thead>
                <tbody>
                    {schedule.exercises.map((exercise, key) => (
                        <div>{exercise.name}</div>
                    ))}
                </tbody>
            </table>
        </div>
    </Card>
}

interface PlanDisplayProps {
    weeklySchedule: DaySchedule[];
}

export function PlanDisplay ({weeklySchedule}: PlanDisplayProps) {
    return (<div>
        {weeklySchedule.map((schedule, key) => (
            <DayCard key={key} schedule={schedule} />
        ))}
    </div>)
}