import React from 'react';
import { Avatar, AvatarFallback, AvatarImage, AvatarGroup } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function AvatarDemo() {
  return (
    <div className="space-y-8 p-6">
      {/* Size Variants Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Avatar Sizes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar size="xs" tooltip="Extra Small">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face" />
              <AvatarFallback>XS</AvatarFallback>
            </Avatar>
            <Avatar size="sm" tooltip="Small">
              <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" />
              <AvatarFallback>SM</AvatarFallback>
            </Avatar>
            <Avatar size="md" tooltip="Medium (Default)">
              <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616c359dfd6?w=400&h=400&fit=crop&crop=face" />
              <AvatarFallback>MD</AvatarFallback>
            </Avatar>
            <Avatar size="lg" tooltip="Large">
              <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face" />
              <AvatarFallback>LG</AvatarFallback>
            </Avatar>
            <Avatar size="xl" tooltip="Extra Large">
              <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face" />
              <AvatarFallback>XL</AvatarFallback>
            </Avatar>
            <Avatar size="2xl" tooltip="2X Large">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face" />
              <AvatarFallback>2XL</AvatarFallback>
            </Avatar>
          </div>
        </CardContent>
      </Card>

      {/* Avatar Groups Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Avatar Groups</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Badge variant="outline" className="mb-3">Team (Normal Spacing)</Badge>
            <AvatarGroup max={4} spacing="normal" size="md">
              <Avatar tooltip="John Doe">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Avatar tooltip="Jane Smith">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616c359dfd6?w=400&h=400&fit=crop&crop=face" />
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <Avatar tooltip="Mike Johnson">
                <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face" />
                <AvatarFallback>MJ</AvatarFallback>
              </Avatar>
              <Avatar tooltip="Sarah Wilson">
                <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face" />
                <AvatarFallback>SW</AvatarFallback>
              </Avatar>
              <Avatar tooltip="Alex Brown">
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <Avatar tooltip="Lisa Davis">
                <AvatarFallback>LD</AvatarFallback>
              </Avatar>
            </AvatarGroup>
          </div>

          <div>
            <Badge variant="outline" className="mb-3">Compact Team (Tight Spacing)</Badge>
            <AvatarGroup max={3} spacing="tight" size="sm">
              <Avatar tooltip="Alice Cooper">
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
              <Avatar tooltip="Bob Martin">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face" />
                <AvatarFallback>BM</AvatarFallback>
              </Avatar>
              <Avatar tooltip="Carol White">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616c359dfd6?w=400&h=400&fit=crop&crop=face" />
                <AvatarFallback>CW</AvatarFallback>
              </Avatar>
              <Avatar tooltip="David Lee">
                <AvatarFallback>DL</AvatarFallback>
              </Avatar>
              <Avatar tooltip="Emma Green">
                <AvatarFallback>EG</AvatarFallback>
              </Avatar>
            </AvatarGroup>
          </div>

          <div>
            <Badge variant="outline" className="mb-3">Leadership (Loose Spacing)</Badge>
            <AvatarGroup max={2} spacing="loose" size="lg">
              <Avatar tooltip="CEO - Robert Johnson">
                <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face" />
                <AvatarFallback>RJ</AvatarFallback>
              </Avatar>
              <Avatar tooltip="CTO - Maria Garcia">
                <AvatarImage src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face" />
                <AvatarFallback>MG</AvatarFallback>
              </Avatar>
              <Avatar tooltip="CFO - James Wilson">
                <AvatarFallback>JW</AvatarFallback>
              </Avatar>
              <Avatar tooltip="CMO - Linda Taylor">
                <AvatarFallback>LT</AvatarFallback>
              </Avatar>
            </AvatarGroup>
          </div>
        </CardContent>
      </Card>

      {/* Tooltip Variants Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Avatars with Tooltips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Avatar 
              size="lg" 
              tooltip="John Doe - Software Engineer"
              className="hover:scale-110 transition-transform cursor-pointer"
            >
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face" />
              <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">JD</AvatarFallback>
            </Avatar>
            
            <Avatar 
              size="lg" 
              tooltip="Jane Smith - UX Designer"
              className="hover:scale-110 transition-transform cursor-pointer"
            >
              <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616c359dfd6?w=400&h=400&fit=crop&crop=face" />
              <AvatarFallback className="bg-gradient-to-br from-green-400 to-blue-500 text-white">JS</AvatarFallback>
            </Avatar>
            
            <Avatar 
              size="lg" 
              tooltip="Mike Johnson - Product Manager"
              className="hover:scale-110 transition-transform cursor-pointer"
            >
              <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face" />
              <AvatarFallback className="bg-gradient-to-br from-orange-400 to-red-500 text-white">MJ</AvatarFallback>
            </Avatar>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}