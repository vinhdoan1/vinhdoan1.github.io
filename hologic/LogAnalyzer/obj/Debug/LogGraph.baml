   M S B A M L   `   `   `  ����  LogAnalyzer    LogAnalyzer.LogGraph   5   	   \ XPresentationFramework, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35W SPresentationCore, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35R NWindowsBase, Version=4.0.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35D 9http://schemas.microsoft.com/winfx/2006/xaml/presentation    5   	   R NSystem.Xaml, Version=4.0.0.0, Culture=neutral, PublicKeyToken=b77a5c561934e089:x,http://schemas.microsoft.com/winfx/2006/xaml     5      -   5          � Title$  howto_wpf_graph��5      $	��800��5      $
��1235��6   .��5      � 
������ � ColumnDefinitions 5   
   �� 5      $	��61* �6   �� 5	      $��1168* �6   .+�5   
   �� $��0��6   $��1��6!   $��Center=�5   
   $��Center=�5   
   $��0.2,30,1134.8,726q�6%   $��16��6@   $��33��6L   ��5   
   ��  �� ElementName$ sliZoom�� �� Path$ Value� �� StringFormat$ {0:P0}��5   L   �� 5   
   -   5        $��sliZoom��5       �� Orientation$ Vertical=�6    $��Center=�5      $��27,30,14.8,5q�5      $��0��6#    � Minimum$
 0.25Q�5       � Maximum$ 10.00Q�6    � Value$
 1.00Q�6,   	 � SmallChange$
	 0.25Q�5      
 � LargeChange$

 0.25Q�6     �� TickFrequency$
 0.25Q�5       �� TickPlacement$ BottomRight=�6"    �� IsSnapToTickEnabled . $��19��5   (   �� 5   
   -   5        $��scvGraph��5      $��0��5      $��1��6   $
��Auto=�5      $
��Auto=�5      $��18.2,0,-0.2,0.4q�60   .��5      �� -   5        $��canGraph��5      
�������$
��1100��5      $	��700��6   $��Center=�5      $��2��6.    J� RenderTransformOrigin$ 
0.419,1.26&�6B    � LayoutTransform 5       �� 5!       �� ScaleX 5"      �� $ sliZoom��$ Value� �� ScaleY 5#      �� $ sliZoom��$ Value�5%      5&      �� 5'   
   -   5         ��Name$ 
Per_Minute��5'      $��
Per Minute��6'   $
��Left=�6<   $��30.2,746,0,0q�6W   $	��Top=�6m   $��1��6�   6�   5(      5)      